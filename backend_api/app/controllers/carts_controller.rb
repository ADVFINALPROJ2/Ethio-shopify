class CartsController < ApplicationController
  before_action :authenticate_user!
  before_action :verify_ownership

  def show
    cart = current_user.cart || current_user.create_cart!

    render json: {
      cart: cart.as_json(
        include: {
          cart_items: {
            include: {
              product: {
                methods: :image_urls
              }
            }
          }
        }
      ),
      subtotal: cart.subtotal
    }, status: :ok
  end

  def checkout
    cart = current_user.cart

    unless cart && cart.cart_items.any?
      render json: { errors: ["Your cart is empty"] }, status: :unprocessable_entity
      return
    end

    orders = []

    ActiveRecord::Base.transaction do
      product_ids = cart.cart_items.pluck(:product_id)

      # Lock product rows to prevent concurrent stock overselling
      Product.where(id: product_ids).lock.load

      cart_items = cart.cart_items
                       .includes(product: :user)
                       .lock

      cart_items.each do |item|
        if item.product.quantity < item.quantity
          raise StandardError,
                "StockError: #{item.product.name} only has #{item.product.quantity} left in stock"
        end
      end

      cart_items.group_by { |item| item.product.user }.each do |seller, items|
        total = items.sum { |item| item.quantity * item.product.price }

        order = current_user.orders.create!(
          seller: seller,
          total: total,
          status: "pending_payment",
          customer_name: current_user.fullname,
          phone_number: params[:phone].presence || current_user.phone_number,
          address: params[:address],
          notes: params[:notes]
        )

        items.each do |item|
          order.order_items.create!(
            product: item.product,
            quantity: item.quantity,
            price: item.product.price
          )

          item.product.decrement_stock!(item.quantity)
        end

        orders << order

        # Preserve notification behavior from incoming PR
        begin
          NewOrderNotificationJob.perform_later(order.id)
        rescue StandardError => e
          Rails.logger.error "Failed to enqueue NewOrderNotificationJob: #{e.message}"
        end
      end

      cart.cart_items.destroy_all
    end

    first_order = orders.first

    render json: {
      order: {
        id: first_order.id,
        order_number: orders.map(&:order_number).join(", "),
        status: first_order.status,
        total: orders.sum(&:total),
        created_at: first_order.created_at
      }
    }, status: :created

  rescue StandardError => e
    error_msg =
      if e.message.start_with?("StockError: ")
        e.message.sub("StockError: ", "")
      else
        e.message
      end

    render json: { errors: [error_msg] }, status: :unprocessable_entity
  end

  private

  def verify_ownership
    return if current_user.id == params[:user_id].to_i

    render json: { error: "Forbidden" }, status: :forbidden
  end
end
