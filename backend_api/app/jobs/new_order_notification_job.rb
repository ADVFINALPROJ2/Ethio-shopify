class NewOrderNotificationJob < ApplicationJob
  queue_as :default

  def perform(order_id)
    order = Order.find_by(id: order_id)
    return if order.nil?

    items_list = order.order_items.map { |oi|
      "#{oi.product_name} x#{oi.quantity} - ETB #{'%.2f' % (oi.price * oi.quantity)}"
    }.join("\n")

    message = "<b>New Order Received!</b>\n\n" \
              "Order ##{order.id}\n" \
              "Customer: #{ERB::Util.html_escape(order.user.fullname.presence || order.user.username.presence || 'Unknown')}\n" \
              "Phone: #{ERB::Util.html_escape(order.phone.presence || 'Not provided')}\n" \
              "Address: #{ERB::Util.html_escape(order.address.presence || 'Not provided')}\n" \
              "Notes: #{ERB::Util.html_escape(order.notes.presence || 'None')}\n\n" \
              "Items:\n#{items_list}\n\n" \
              "Total: ETB #{'%.2f' % order.order_items.sum { |oi| oi.price * oi.quantity }}"

    TelegramNotificationService.new.send_message(message)
  end
end
