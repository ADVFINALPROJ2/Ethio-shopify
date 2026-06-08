require "test_helper"

class ProductsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @product = products(:one)
  end

  test "should get index" do
    get products_url, as: :json
    assert_response :success
  end

  test "should create product" do
    assert_difference("Product.count") do
      post products_url, params: { product: { name: "New Product", price: 29.99, user_id: @user.id } }, as: :json
    end
    assert_response :created
  end

  test "should not create product without name" do
    post products_url, params: { product: { price: 29.99, user_id: @user.id } }, as: :json
    assert_response :unprocessable_entity
  end

  test "should show product" do
    get product_url(@product), as: :json
    assert_response :success
  end

  test "should update product" do
    patch product_url(@product), params: { product: { name: "Updated Name" } }, as: :json
    assert_response :success
    @product.reload
    assert_equal "Updated Name", @product.name
  end

  test "should destroy product" do
    assert_difference("Product.count", -1) do
      delete product_url(@product), as: :json
    end
    assert_response :no_content
  end

  test "should purchase product and decrement stock" do
    original_qty = @product.quantity
    post purchase_product_url(@product), params: { quantity: 1 }, as: :json
    assert_response :success
    @product.reload
    assert_equal original_qty - 1, @product.quantity
  end

  test "should reject purchase when insufficient stock" do
    @product.update!(quantity: 0)
    post purchase_product_url(@product), params: { quantity: 1 }, as: :json
    assert_response :unprocessable_entity
  end
end
