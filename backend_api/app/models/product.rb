class Product < ApplicationRecord
  belongs_to :user
  belongs_to :shop, optional: true
  belongs_to :category, optional: true

  has_many :order_items
  has_many :cart_items

  has_many_attached :images

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :quantity, numericality: { greater_than_or_equal_to: 0 }, if: -> { quantity.present? }
  validates :status, inclusion: { in: %w[active inactive archived] }

  after_update :check_low_stock, if: :saved_change_to_quantity?

  def image_urls
    images.map { |img| Rails.application.routes.url_helpers.rails_blob_url(img, only_path: true) }
  end

  def decrement_stock!(quantity = 1)
    return if quantity <= 0
    new_quantity = self.quantity - quantity
    if new_quantity < 0
      errors.add(:quantity, "Insufficient stock: only #{self.quantity} left")
      raise ActiveRecord::RecordInvalid, self
    end
    update!(quantity: new_quantity)
  end

  private

  def check_low_stock
    def check_low_stock
      return unless low_stock_threshold.present?
      return unless quantity.present?
      return if quantity > low_stock_threshold

    LowStockAlertJob.perform_later(id)
  end
end
