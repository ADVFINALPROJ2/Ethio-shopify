require "test_helper"

class CheckoutsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @cart = carts(:one)
    @product = products(:two)
    @cart.cart_items.create!(product: @product, quantity: 2)
  end

  test "should create order from cart" do
    post checkout_url, params: { user_id: @user.id }, as: :json

    assert_response :created
    json = response.parsed_body

    assert_equal "pending_payment", json["status"]
    assert_equal 2, json["items"].length
    assert_equal "pending_payment", json["payment"]["status"]
  end

  test "should return error if cart is empty" do
    @cart.cart_items.destroy_all

    post checkout_url, params: { user_id: @user.id }, as: :json

    assert_response :unprocessable_entity
    assert_includes response.parsed_body["errors"], "Cart is empty"
  end

  test "should return error if user not found" do
    post checkout_url, params: { user_id: 99999 }, as: :json

    assert_response :not_found
    assert_includes response.parsed_body["errors"], "User not found"
  end

  test "should return error if insufficient stock" do
    @product.update!(quantity: 1)

    post checkout_url, params: { user_id: @user.id }, as: :json

    assert_response :unprocessable_entity
    assert_includes response.parsed_body["errors"].first, "Insufficient stock"
  end

  test "should decrement stock after checkout" do
    assert_difference -> { @product.reload.quantity }, -2 do
      post checkout_url, params: { user_id: @user.id }, as: :json
    end
  end

  test "should clear cart after checkout" do
    post checkout_url, params: { user_id: @user.id }, as: :json

    assert_response :created
    assert_equal 0, @cart.reload.cart_items.count
  end

  test "should lock prices at checkout time" do
    original_price = @product.price

    post checkout_url, params: { user_id: @user.id }, as: :json

    assert_response :created
    json = response.parsed_body
    price_in_order = json["items"].find { |i| i["product_id"] == @product.id }["price"]
    assert_equal original_price.to_f, price_in_order

    @product.update!(price: 99.99)
    assert_equal original_price.to_f, OrderItem.find_by(product: @product).price.to_f
  end
end
