class AuthController < ApplicationController
  skip_before_action :authenticate_user!, only: [:telegram], raise: false
  before_action :authenticate_user!, only: [:me, :update]

  # POST /auth/telegram
  def telegram
    init_data = params[:initData]
    if init_data.blank?
      render json: { error: "Missing initData" }, status: :bad_request
      return
    end

    bot_token = ENV["TELEGRAM_BOT_TOKEN"]
    if bot_token.blank?
      render json: { error: "Telegram bot token is not configured on the server" }, status: :internal_server_error
      return
    end

    # Parse query string params
    parsed_params = Rack::Utils.parse_nested_query(init_data)
    
    # Verify signature
    unless valid_telegram_signature?(parsed_params, bot_token)
      render json: { error: "Invalid Telegram authentication signature" }, status: :unauthorized
      return
    end

    # Check data freshness (reject if older than 24 hours)
    auth_date = parsed_params["auth_date"].to_i
    if auth_date.zero? || (Time.now.to_i - auth_date).abs > 24.hours.to_i
      render json: { error: "Authentication data has expired or has an invalid timestamp" }, status: :unauthorized
      return
    end

    # Extract user data
    user_json = parsed_params["user"]
    if user_json.blank?
      render json: { error: "User details missing from Telegram payload" }, status: :bad_request
      return
    end

    begin
      telegram_user = JSON.parse(user_json)
    rescue JSON::ParserError
      render json: { error: "Malformed user JSON payload" }, status: :bad_request
      return
    end

    telegram_id = telegram_user["id"].to_s
    if telegram_id.blank?
      render json: { error: "Telegram user ID is missing" }, status: :bad_request
      return
    end

    # Find or create user
    user = User.find_or_create_by!(telegram_id: telegram_id) do |u|
      u.username = telegram_user["username"]
      u.first_name = telegram_user["first_name"]
      u.last_name = telegram_user["last_name"]
      u.fullname = [telegram_user["first_name"], telegram_user["last_name"]].compact.join(" ")
    end

    # Update attributes if they changed
    user.update!(
      username: telegram_user["username"],
      first_name: telegram_user["first_name"],
      last_name: telegram_user["last_name"],
      fullname: [telegram_user["first_name"], telegram_user["last_name"]].compact.join(" ")
    )

    # Ensure a Cart exists for this user (required by carts table constraints)
    user.create_cart! unless user.cart.present?

    # Generate JWT
    token = JsonWebToken.encode(user_id: user.id)

    render json: {
      token: token,
      user: user_json(user)
    }, status: :ok
  rescue => e
    render json: { error: "Authentication failed: #{e.message}" }, status: :unprocessable_entity
  end

  # GET /me
  def me
    render json: {
      user: user_json(current_user)
    }, status: :ok
  end

  # PATCH /me
  def update
    if current_user.update(user_params.except(:avatar))
      current_user.avatar.attach(user_params[:avatar]) if user_params[:avatar].present?
      render json: { user: user_json(current_user) }, status: :ok
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:fullname, :phone_number, :email, :avatar)
  end

  def user_json(user)
    user.as_json(except: [:created_at, :updated_at])
        .merge("avatar_url" => avatar_url(user), "has_shop" => user.shop.present?)
  end

  def avatar_url(user)
    return unless user.avatar.attached?

    Rails.application.routes.url_helpers.rails_blob_url(user.avatar, only_path: true)
  end

  def valid_telegram_signature?(params, bot_token)
    hash = params["hash"]
    return false if hash.blank?

    # Sort key-value pairs alphabetically (excluding the hash itself)
    sorted_pairs = params.except("hash").sort.map { |k, v| "#{k}=#{v}" }
    data_check_string = sorted_pairs.join("\n")

    # Secret key is the HMAC-SHA256 of the bot token using "WebAppData" as the key
    secret_key = OpenSSL::HMAC.digest(OpenSSL::Digest.new("sha256"), "WebAppData", bot_token)
    
    # Computed hash is the HMAC-SHA256 of the data check string using secret_key
    computed_hash = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new("sha256"), secret_key, data_check_string)

    # Secure constant-time comparison
    ActiveSupport::SecurityUtils.secure_compare(computed_hash, hash)
  end
end
