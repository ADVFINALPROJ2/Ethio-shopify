class AddSnapshotFieldsToOrderItems < ActiveRecord::Migration[8.1]
  def change
    add_column :order_items, :product_name, :string, null: false
    add_column :order_items, :product_price, :decimal, precision: 10, scale: 2, null: false
  end
end
