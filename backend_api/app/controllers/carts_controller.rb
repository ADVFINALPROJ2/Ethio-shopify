class CartsController < ApplicationController
  def show
    user = User.find(params[:user_id])
    cart = user.cart || user.create_cart!

    render json: {
      cart: cart.as_json(include: { cart_items: { include: { product: { methods: :image_urls } } } }),
      subtotal: cart.subtotal
    }, status: :ok
  end
end
