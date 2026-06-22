class OrdersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_order, only: [ :show ]

  def index
    orders = current_user.seller_orders.includes(:user, order_items: { product: { images_attachments: :blob } })
                         .order(created_at: :desc)
    render json: orders.map { |order| order_json(order) }, status: :ok
  end

  def show
    render json: order_json(@order), status: :ok
  end

  private

  def set_order
    @order = current_user.seller_orders.includes(:user, order_items: { product: { images_attachments: :blob } })
                         .find(params[:id])
  end

  def order_json(order)
    {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      total: order.total,
      customer_name: order.customer_name || order.user&.fullname || order.user&.username,
      phone_number: order.phone_number,
      address: order.address,
      city: order.city,
      region: order.region,
      country: order.country,
      created_at: order.created_at,
      order_items: order.order_items.map { |item| order_item_json(item) }
    }
  end

  def order_item_json(item)
    product = item.product
    {
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      product_name: item.product_name,
      product_price: item.product_price,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image_urls: product.image_urls
      }
    }
  end
end
