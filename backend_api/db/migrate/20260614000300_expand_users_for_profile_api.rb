class ExpandUsersForProfileApi < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :email, :string unless column_exists?(:users, :email)
  end
end
