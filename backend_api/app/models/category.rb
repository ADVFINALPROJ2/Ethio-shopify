class Category < ApplicationRecord
  has_many :products
  has_many :shops
end
