class LowStockAlertJob < ApplicationJob
  queue_as :default

  def perform(product_id)
    product = Product.find_by(id: product_id)
    return if product.nil?
    return if product.quantity > product.low_stock_threshold

    TelegramNotificationService.notify_low_stock(product)
  end
end
