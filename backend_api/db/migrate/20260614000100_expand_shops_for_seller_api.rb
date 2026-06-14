class ExpandShopsForSellerApi < ActiveRecord::Migration[8.1]
  def change
    add_column :shops, :name, :string unless column_exists?(:shops, :name)
    add_column :shops, :category, :string unless column_exists?(:shops, :category)
    add_column :shops, :description, :text unless column_exists?(:shops, :description)
    add_column :shops, :email, :string unless column_exists?(:shops, :email)
    add_column :shops, :phone_code, :string unless column_exists?(:shops, :phone_code)
    add_column :shops, :phone_number, :string unless column_exists?(:shops, :phone_number)
    add_column :shops, :address, :string unless column_exists?(:shops, :address)
    add_column :shops, :country, :string unless column_exists?(:shops, :country)
    add_column :shops, :region, :string unless column_exists?(:shops, :region)
    add_column :shops, :city, :string unless column_exists?(:shops, :city)
    add_column :shops, :status, :string, default: "active" unless column_exists?(:shops, :status)
  end
end
