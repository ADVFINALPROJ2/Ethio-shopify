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

  test "should have default low_stock_threshold" do
    product = Product.new(
      name: "Test",
      price: 10,
      quantity: 5,
      user: @product.user,
      shop: shops(:one),
      product_category: product_categories(:one)
    )
    assert_equal 5, product.low_stock_threshold
  end

  test "low_stock_alert_job should be enqueued when stock below threshold" do
    product = products(:two)
    assert_enqueued_with(job: LowStockAlertJob, args: [ product.id ]) do
      product.update!(quantity: 2)
    end
  end

  test "low_stock_alert_job should not be enqueued when stock above threshold" do
    product = products(:one)
    assert_no_enqueued_jobs(only: LowStockAlertJob) do
      product.update!(quantity: 8)
    end
  end
end
