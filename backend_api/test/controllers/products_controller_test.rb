require "test_helper"

class ProductsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @product = products(:one)
    @token = JsonWebToken.encode(user_id: @user.id)
    @headers = { "Authorization" => "Bearer #{@token}" }
  end

  test "should get index" do
    get products_url, headers: @headers, as: :json
    assert_response :success
  end

  test "should create product" do
    assert_difference("Product.count") do
      post products_url, params: {
        product: {
          name: "New Product",
          price: 29.99,
          product_category_id: product_categories(:one).id
        }
      }, headers: @headers, as: :json
    end
    assert_response :created
  end

  test "should not create product without name" do
    post products_url, params: { product: { price: 29.99, user_id: @user.id } }, headers: @headers, as: :json
    assert_response :unprocessable_entity
  end

  test "should show product" do
    get product_url(@product), headers: @headers, as: :json
    assert_response :success
  end

  test "should update product" do
    patch product_url(@product), params: { product: { name: "Updated Name" } }, headers: @headers, as: :json
    assert_response :success
    @product.reload
    assert_equal "Updated Name", @product.name
  end

  test "should destroy product" do
    disposable_product = Product.create!(
      name: "Disposable Product",
      price: 9.99,
      quantity: 1,
      user: @user,
      shop: shops(:one),
      product_category: product_categories(:one)
    )

    assert_difference("Product.count", -1) do
      delete product_url(disposable_product), headers: @headers, as: :json
    end
    assert_response :no_content
  end

  test "should purchase product and decrement stock" do
    original_qty = @product.quantity
    post purchase_product_url(@product), params: { quantity: 1 }, headers: @headers, as: :json
    assert_response :success
    @product.reload
    assert_equal original_qty - 1, @product.quantity
  end

  test "should restock product and increment stock" do
    @product.update!(quantity: 5)
    post restock_product_url(@product), params: { quantity: 2 }, headers: @headers, as: :json
    assert_response :success
    @product.reload
    assert_equal 7, @product.quantity
  end

  test "should reject restock with non-positive quantity" do
    post restock_product_url(@product), params: { quantity: 0 }, headers: @headers, as: :json
    assert_response :unprocessable_entity
  end

  test "should reject purchase when insufficient stock" do
    @product.update!(quantity: 0)
    post purchase_product_url(@product), params: { quantity: 1 }, headers: @headers, as: :json
    assert_response :unprocessable_entity
  end
end
