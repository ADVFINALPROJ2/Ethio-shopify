class Product < ApplicationRecord
  belongs_to :user

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :quantity, numericality: { greater_than_or_equal_to: 0 }, if: -> { quantity.present? }
  validates :status, inclusion: { in: %w[active inactive archived] }
end
