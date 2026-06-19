class AddStatusToOrders < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :status, :string, default: "pending_payment"
  end
end
