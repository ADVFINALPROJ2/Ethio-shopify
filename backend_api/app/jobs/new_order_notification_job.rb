class NewOrderNotificationJob < ApplicationJob
  queue_as :default

  def perform(order_id)
    order = Order.find_by(id: order_id)
    return if order.nil?

    TelegramNotificationService.notify_new_order(order)
  end
end
