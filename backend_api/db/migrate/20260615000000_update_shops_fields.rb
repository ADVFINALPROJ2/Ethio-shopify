class UpdateShopsFields < ActiveRecord::Migration[8.1]
  def change
    add_column :shops, :slug, :string unless column_exists?(:shops, :slug)
    add_index :shops, :slug, unique: true unless index_exists?(:shops, :slug)

    remove_column :shops, :category if column_exists?(:shops, :category)
    add_reference :shops, :category, foreign_key: true unless column_exists?(:shops, :category_id)

    if column_exists?(:shops, :user_id)
      remove_foreign_key :shops, :users if foreign_key_exists?(:shops, :users)
      rename_column :shops, :user_id, :owner_id
    end
    add_foreign_key :shops, :users, column: :owner_id unless foreign_key_exists?(:shops, :users, column: :owner_id)
  end
end
