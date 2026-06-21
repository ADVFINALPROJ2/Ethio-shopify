class ExpandOrdersForSellerApi < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :status, :string, default: "pending" unless column_exists?(:orders, :status)
    add_column :orders, :total, :decimal, precision: 10, scale: 2 unless column_exists?(:orders, :total)
    add_column :orders, :customer_name, :string unless column_exists?(:orders, :customer_name)
    add_column :orders, :phone_number, :string unless column_exists?(:orders, :phone_number)
    add_column :orders, :address, :string unless column_exists?(:orders, :address)
    add_column :orders, :city, :string unless column_exists?(:orders, :city)
    add_column :orders, :region, :string unless column_exists?(:orders, :region)
    add_column :orders, :country, :string unless column_exists?(:orders, :country)

    unless column_exists?(:orders, :seller_id)
      add_reference :orders, :seller, foreign_key: { to_table: :users }, index: true
    end
  end
end
