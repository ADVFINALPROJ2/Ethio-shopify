class AddShopAndCategoryToProducts < ActiveRecord::Migration[8.1]
  def change
    add_reference :products, :shop, null: false, foreign_key: true
    add_reference :products, :category, foreign_key: true
  end
end
