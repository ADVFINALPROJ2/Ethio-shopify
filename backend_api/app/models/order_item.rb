class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product

  before_create :take_product_snapshot

  private

  def take_product_snapshot
    self.product_name = product.name
    self.product_price = product.price
  end
end
