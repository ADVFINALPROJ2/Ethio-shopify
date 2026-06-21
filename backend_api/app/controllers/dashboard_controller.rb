class DashboardController < ApplicationController
  before_action :authenticate_user!

  def stats
    products = current_user.products.includes(images_attachments: :blob).order(created_at: :desc)
    orders = current_user.seller_orders

    render json: {
      total_products: products.count,
      total_orders: orders.count,
      total_sales: orders.sum(:total).to_s,
      shop_views: 0,
      recent_products: products.limit(5).map { |product| product_json(product) }
    }, status: :ok
  end

  private

  def product_json(product)
    product.as_json(only: [ :id, :name, :description, :price, :quantity, :status, :created_at ])
           .merge("image_urls" => product.image_urls)
  end
end
