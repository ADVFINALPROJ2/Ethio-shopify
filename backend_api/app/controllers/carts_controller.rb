class CartsController < ApplicationController
  def show
    user = User.find(params[:user_id])
    cart = user.cart || user.create_cart!

    render json: {
      cart: cart.as_json(include: { cart_items: { include: { product: { methods: :image_urls } } } }),
      subtotal: cart.subtotal
    }, status: :ok
  end

  def checkout
    user = User.find(params[:user_id])
    cart = user.cart

    unless cart && cart.cart_items.any?
      render json: { errors: ["Your cart is empty"] }, status: :unprocessable_entity
      return
    end

    cart_items = cart.cart_items.includes(product: :user)

    cart_items.each do |item|
      if item.product.quantity < item.quantity
        render json: { errors: ["#{item.product.name} only has #{item.product.quantity} left in stock"] }, status: :unprocessable_entity
        return
      end
    end

    seller = cart_items.first.product.user

    total = cart_items.sum { |item| item.quantity * item.product.price }

    order = user.orders.create!(
      seller: seller,
      total: total,
      status: "pending",
      customer_name: user.fullname,
      phone_number: user.phone_number
    )

    cart_items.each do |item|
      order.order_items.create!(
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      )
      item.product.decrement_stock!(item.quantity)
    end

    cart.cart_items.destroy_all

    render json: {
      order: {
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        total: order.total,
        created_at: order.created_at
      }
    }, status: :created
  end
end
