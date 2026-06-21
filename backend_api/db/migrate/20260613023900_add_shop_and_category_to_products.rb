class AddShopAndCategoryToProducts < ActiveRecord::Migration[8.1]
  def change
    add_reference :products, :shop, null: false, foreign_key: true, index: true
    add_reference :products, :category, foreign_key: true, index: true
  end
end
