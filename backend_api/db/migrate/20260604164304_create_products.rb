class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.references :user, null: false, foreign_key: true
      t.integer :quantity, default: 0
      t.string :status, default: "active"

      t.timestamps
    end
  end
end
