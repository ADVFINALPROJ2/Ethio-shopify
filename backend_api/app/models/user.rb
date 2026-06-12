class User < ApplicationRecord
  has_one :shop
  has_one :cart, dependent: :destroy
  has_many :orders
end
