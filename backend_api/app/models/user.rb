class User < ApplicationRecord
  has_one :shop
  has_one :cart, dependent: :destroy
  has_many :orders

  validates :telegram_id, presence: true, uniqueness: true
end
