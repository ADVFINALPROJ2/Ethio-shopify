class Order < ApplicationRecord
  belongs_to :user
  belongs_to :seller, class_name: "User", optional: true

  has_many :order_items, dependent: :destroy
  has_one :payment, dependent: :destroy

  validates :status, inclusion: { in: %w[pending pending_payment paid processing accepted shipped completed cancelled] }
  validates :total, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  scope :for_seller, ->(seller) { where(seller_id: seller.id) }

  def order_number
    "#ORD-#{id}"
  end
end
