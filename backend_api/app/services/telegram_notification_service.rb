class TelegramNotificationService
  def initialize
    @bot_token = ENV["TELEGRAM_BOT_TOKEN"]
    @chat_id = ENV["TELEGRAM_CHAT_ID"]
  end

  def send_message(message)
    return if @bot_token.blank? || @chat_id.blank?

    uri = URI("https://api.telegram.org/bot#{@bot_token}/sendMessage")
    body = { chat_id: @chat_id, text: message, parse_mode: "HTML" }

    begin
      response = Net::HTTP.post(
        uri,
        body.to_json,
        "Content-Type" => "application/json"
      )
      Rails.logger.info "Telegram notification sent: #{response.code}"
    rescue StandardError => e
      Rails.logger.error "Telegram notification failed: #{e.message}"
    end
  end

  def self.notify_low_stock(product)
    message = "<b>Low Stock Alert!</b>\n\n" \
              "Product: #{product.name}\n" \
              "Current Stock: #{product.quantity}\n" \
              "Threshold: #{product.low_stock_threshold}\n" \
              "Status: #{product.status}"

    new.send_message(message)
  end
end
