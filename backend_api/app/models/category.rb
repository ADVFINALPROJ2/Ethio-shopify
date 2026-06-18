class Category < ApplicationRecord
  has_many :shops
  has_many :product_categories
end
