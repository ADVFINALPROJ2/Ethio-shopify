class ReplaceCategoryWithProductCategoryOnProducts < ActiveRecord::Migration[8.1]
  def change
    remove_reference :products, :category, foreign_key: true

    add_reference :products,
                  :product_category,
                  foreign_key: true
  end
end