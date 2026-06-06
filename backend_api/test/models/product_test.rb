require "test_helper"

class ProductTest < ActiveSupport::TestCase
  def setup
    @user = users(:one)
    @product = Product.new(
      name: "Test Product",
      description: "A test product",
      price: 29.99,
      user: @user,
      quantity: 10,
      status: "active"
    )
  end

  test "should be valid" do
    assert @product.valid?
  end

  test "name should be present" do
    @product.name = nil
    assert_not @product.valid?
    assert_includes @product.errors[:name], "can't be blank"
  end

  test "price should be present" do
    @product.price = nil
    assert_not @product.valid?
    assert_includes @product.errors[:price], "can't be blank"
  end

  test "price should be non-negative" do
    @product.price = -1
    assert_not @product.valid?
  end

  test "price should be zero" do
    @product.price = 0
    assert @product.valid?
  end

  test "quantity should default to zero" do
    product = Product.new(
      name: "No Quantity",
      price: 9.99,
      user: @user
    )
    assert_equal 0, product.quantity
  end

  test "quantity should be non-negative" do
    @product.quantity = -5
    assert_not @product.valid?
  end

  test "status should default to active" do
    product = Product.new(
      name: "Default Status",
      price: 9.99,
      user: @user
    )
    assert_equal "active", product.status
  end

  test "status should be valid" do
    valid_statuses = %w[active inactive archived]
    valid_statuses.each do |s|
      @product.status = s
      assert @product.valid?, "#{s} should be a valid status"
    end
  end

  test "status should reject invalid values" do
    @product.status = "deleted"
    assert_not @product.valid?
  end

  test "should belong to a user" do
    assert_respond_to @product, :user
  end
end
