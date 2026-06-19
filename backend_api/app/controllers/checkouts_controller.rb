class CheckoutsController < ApplicationController
  before_action :set_user
  before_action :set_cart

  def create
    unless @cart.cart_items.any?
      render json: { errors: ["Cart is empty"] }, status: :unprocessable_entity
      return
    end

    @cart.cart_items.each do |item|
      if item.product.quantity < item.quantity
        render json: { errors: ["Insufficient stock for #{item.product.name}: only #{item.product.quantity} available"] }, status: :unprocessable_entity
        return
      end
    end

    order = nil
    ActiveRecord::Base.transaction do
      order = @user.orders.create!(status: :pending_payment)

      @cart.cart_items.each do |item|
        order.order_items.create!(
          product: item.product,
          quantity: item.quantity,
          price: item.product.price
        )

        item.product.decrement_stock!(item.quantity)
      end

      order.create_payment!(
        amount: order.order_items.sum { |oi| oi.price * oi.quantity },
        status: "pending_payment"
      )

      @cart.cart_items.destroy_all
    end

    render json: order_json(order), status: :created
  end

  private

  def set_user
    @user = User.find_by(id: params[:user_id])
    unless @user
      render json: { errors: ["User not found"] }, status: :not_found
      return
    end
  end

  def set_cart
    return if performed?
    @cart = @user.cart
    unless @cart
      render json: { errors: ["Cart not found"] }, status: :not_found
      return
    end
  end

  def order_json(order)
    {
      id: order.id,
      status: order.status,
      total: order.order_items.sum { |oi| oi.price * oi.quantity },
      items: order.order_items.map { |oi|
        {
          product_id: oi.product_id,
          product_name: oi.product.name,
          quantity: oi.quantity,
          price: oi.price.to_f
        }
      },
      payment: {
        amount: order.payment.amount.to_f,
        status: order.payment.status
      },
      created_at: order.created_at
    }
  end
end
