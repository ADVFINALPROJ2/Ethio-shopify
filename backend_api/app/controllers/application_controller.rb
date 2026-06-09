class ApplicationController < ActionController::API
  attr_reader :current_user

  def authenticate_user!
    header = request.headers["Authorization"]
    token = header.split(" ").last if header
    decoded = token ? JsonWebToken.decode(token) : nil

    if decoded && decoded[:user_id]
      @current_user = User.find_by(id: decoded[:user_id])
    end

    unless @current_user
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end
end
