class Cart < ApplicationRecord
  belongs_to :user
  has_many :cart_items, dependent: :destroy

  validates :user_id, uniqueness: { message: "already has a cart" }

  def subtotal
    cart_items.includes(:product).sum { |item| item.quantity.to_i * item.product.price }
  end
end
