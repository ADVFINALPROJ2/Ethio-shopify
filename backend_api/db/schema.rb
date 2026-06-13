# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_13_023900) do
  create_schema "extensions"

  # These are extensions that must be enabled in order to support this database
  enable_extension "extensions.pg_stat_statements"
  enable_extension "extensions.pgcrypto"
  enable_extension "extensions.uuid-ossp"
  enable_extension "pg_catalog.plpgsql"
  enable_extension "vault.supabase_vault"

  create_table "public.active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "public.active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "public.active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "public.cart_items", force: :cascade do |t|
    t.bigint "cart_id", null: false
    t.datetime "created_at", null: false
    t.bigint "product_id", null: false
    t.integer "quantity"
    t.datetime "updated_at", null: false
    t.index ["cart_id"], name: "index_cart_items_on_cart_id"
    t.index ["product_id"], name: "index_cart_items_on_product_id"
  end

  create_table "public.carts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_carts_on_user_id"
  end

  create_table "public.categories", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "public.order_items", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "order_id", null: false
    t.decimal "price"
    t.bigint "product_id", null: false
    t.integer "quantity"
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_order_items_on_order_id"
    t.index ["product_id"], name: "index_order_items_on_product_id"
  end

  create_table "public.orders", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "public.payments", force: :cascade do |t|
    t.decimal "amount"
    t.datetime "created_at", null: false
    t.bigint "order_id", null: false
    t.string "status"
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_payments_on_order_id"
  end

  create_table "public.products", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "low_stock_threshold", default: 5
    t.string "name", null: false
    t.decimal "price", precision: 10, scale: 2, null: false
    t.integer "quantity", default: 0
    t.string "status", default: "active"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_products_on_user_id"
  end

  create_table "public.shops", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_shops_on_user_id"
  end

  create_table "public.users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "first_name"
    t.string "fullname"
    t.string "last_name"
    t.string "phone_number"
    t.string "telegram_id"
    t.datetime "updated_at", null: false
    t.string "username"
    t.index ["telegram_id"], name: "index_users_on_telegram_id", unique: true
  end

  add_foreign_key "public.active_storage_attachments", "public.active_storage_blobs", column: "blob_id"
  add_foreign_key "public.active_storage_variant_records", "public.active_storage_blobs", column: "blob_id"
  add_foreign_key "public.cart_items", "public.carts"
  add_foreign_key "public.cart_items", "public.products"
  add_foreign_key "public.carts", "public.users"
  add_foreign_key "public.order_items", "public.orders"
  add_foreign_key "public.order_items", "public.products"
  add_foreign_key "public.orders", "public.users"
  add_foreign_key "public.payments", "public.orders"
  add_foreign_key "public.products", "public.users"
  add_foreign_key "public.shops", "public.users"

end
