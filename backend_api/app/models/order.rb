class Order < ApplicationRecord
  belongs_to :user

  has_many :order_items, dependent: :destroy
  has_one :payment, dependent: :destroy

  enum :status, {
    pending_payment: "pending_payment",
    paid: "paid",
    accepted: "accepted",
    shipped: "shipped",
    completed: "completed",
    cancelled: "cancelled"
  }

  validates :status, inclusion: { in: statuses.keys }
end
