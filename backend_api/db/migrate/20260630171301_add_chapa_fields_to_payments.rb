class AddChapaFieldsToPayments < ActiveRecord::Migration[8.1]
  def change
    add_column :payments, :tx_ref, :string
    add_column :payments, :chapa_reference, :string
    add_column :payments, :currency, :string, default: "ETB"

    add_index :payments, :tx_ref, unique: true
  end
end
