class User < ApplicationRecord
  has_one :shop, foreign_key: :owner_id, dependent: :destroy
  has_one :cart, dependent: :destroy
  has_many :orders
  has_many :seller_orders, class_name: "Order", foreign_key: :seller_id, inverse_of: :seller
  has_many :products
  has_one_attached :avatar

  validates :telegram_id, presence: true, uniqueness: true
end
