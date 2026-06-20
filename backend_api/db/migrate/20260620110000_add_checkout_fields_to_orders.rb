class AddCheckoutFieldsToOrders < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :phone, :string
    add_column :orders, :address, :text
    add_column :orders, :notes, :text
  end
end
