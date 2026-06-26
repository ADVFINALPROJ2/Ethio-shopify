ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    include ActiveJob::TestHelper

    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Load fixtures in dependency order to prevent referential integrity issues
    fixtures :users
    fixtures :categories
    fixtures :product_categories
    fixtures :shops
    fixtures :products
    fixtures :carts
    fixtures :orders
    fixtures :cart_items
    fixtures :order_items
    fixtures :payments

    # Add more helper methods to be used by all tests here...
  end
end
