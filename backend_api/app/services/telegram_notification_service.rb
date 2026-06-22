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
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.open_timeout = 5
      http.read_timeout = 10
      request = Net::HTTP::Post.new(uri.path)
      request["Content-Type"] = "application/json"
      request.body = body.to_json
      response = http.request(request)
      response = http.request(request)
      if response.is_a?(Net::HTTPSuccess)
        Rails.logger.info "Telegram notification sent: #{response.code}"
      else
        Rails.logger.error "Telegram notification failed with status #{response.code}: #{response.body}"
      end
    rescue StandardError => e
      Rails.logger.error "Telegram notification failed: #{e.message}"
    end
  end

  def self.notify_low_stock(product)
    require "erb"

    message = "<b>Low Stock Alert!</b>\n\n" \
              "Product: #{ERB::Util.html_escape(product.name)}\n" \
              "Current Stock: #{product.quantity}\n" \
              "Threshold: #{product.low_stock_threshold}\n" \
              "Status: #{ERB::Util.html_escape(product.status)}"

    new.send_message(message)
  end

  def self.notify_new_order(order)
    require "erb"

    items = order.order_items.map { |i| "#{i.product_name} x#{i.quantity} - ETB #{i.price}" }.join("\n")

    message = "<b>New Order Received!</b>\n\n" \
              "Order: #{order.order_number}\n" \
              "Customer: #{ERB::Util.html_escape(order.customer_name || 'Unknown')}\n" \
              "Phone: #{order.phone_number || 'N/A'}\n" \
              "Total: ETB #{order.total}\n\n" \
              "Items:\n#{items}"

    new.send_message(message)
  end
end
