require "test_helper"

class ProductTest < ActiveSupport::TestCase
  setup do
    @product = products(:one)
  end

  test "should be valid" do
    assert @product.valid?
  end

  test "should require name" do
    @product.name = nil
    assert_not @product.valid?
  end

  test "should require price" do
    @product.price = nil
    assert_not @product.valid?
  end

  test "should require non-negative price" do
    @product.price = -1
    assert_not @product.valid?
  end

  test "decrement_stock should reduce quantity" do
    @product.update!(quantity: 5)
    @product.decrement_stock!(2)
    assert_equal 3, @product.reload.quantity
  end

  test "decrement_stock should raise if insufficient stock" do
    @product.update!(quantity: 1)
    assert_raises(ActiveRecord::RecordInvalid) { @product.decrement_stock!(5) }
  end

  test "status should be active, inactive, or archived" do
    assert @product.valid?
    @product.status = "invalid"
    assert_not @product.valid?
  end
end
