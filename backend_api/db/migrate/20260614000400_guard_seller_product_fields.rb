class GuardSellerProductFields < ActiveRecord::Migration[8.1]
  def change
    unless column_exists?(:products, :shop_id)
      add_reference :products, :shop, foreign_key: true, index: true
    end

    unless column_exists?(:products, :category_id)
      add_reference :products, :category, foreign_key: true, index: true
    end

    add_column :categories, :name, :string unless column_exists?(:categories, :name)
  end
end
