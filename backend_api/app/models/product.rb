class Product < ApplicationRecord
  belongs_to :user
  belongs_to :shop
  belongs_to :product_category

  has_many :order_items, dependent: :destroy
  has_many :cart_items, dependent: :destroy

  has_many_attached :images

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :quantity, numericality: { greater_than_or_equal_to: 0 }, if: -> { quantity.present? }
  validates :low_stock_threshold, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
  validates :status, inclusion: { in: %w[active inactive archived] }
  validate :product_category_matches_shop

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
      return unless low_stock_threshold.present?
      return unless quantity.present?

      prev_qty, curr_qty = saved_change_to_quantity
      return if prev_qty.nil? || prev_qty <= low_stock_threshold
      return if curr_qty > low_stock_threshold

      LowStockAlertJob.perform_later(id)
    end

    def product_category_matches_shop
      return unless shop && product_category

      unless product_category.category_id == shop.category_id
        errors.add(
          :product_category,
          "must belong to the shop category"
        )
      end
    end
end
