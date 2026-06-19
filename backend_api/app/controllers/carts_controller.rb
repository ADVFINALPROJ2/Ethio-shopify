class CartsController < ApplicationController
  def show
    user = User.find_by(id: params[:user_id])
    unless user
      render json: { errors: ["User not found"] }, status: :not_found
      return
    end

    cart = user.cart || user.create_cart!

    render json: {
      cart: cart.as_json(include: { cart_items: { include: { product: { methods: :image_urls } } } }),
      subtotal: cart.subtotal
    }, status: :ok
  end
end
