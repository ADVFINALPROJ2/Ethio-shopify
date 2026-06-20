class CartItemsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_cart

  def create
    unless params[:product_id].present? && params[:quantity].present?
      render json: { errors: ["product_id and quantity are required"] }, status: :unprocessable_entity
      return
    end

    unless params[:quantity].to_i > 0
      render json: { errors: ["quantity must be greater than 0"] }, status: :unprocessable_entity
      return
    end

    product = Product.find(params[:product_id])
    cart_item = @cart.cart_items.find_or_initialize_by(product_id: params[:product_id])
    new_total = (cart_item.quantity || 0) + params[:quantity].to_i

    if product.quantity < new_total
      render json: { errors: ["Insufficient stock: only #{product.quantity} available, you have #{cart_item.quantity || 0} in cart"] }, status: :unprocessable_entity
      return
    end

    cart_item.quantity = new_total

    if cart_item.save
      render json: cart_response, status: :created
    else
      render json: { errors: cart_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    cart_item = @cart.cart_items.find(params[:id])

    unless params[:quantity].present? && params[:quantity].to_i > 0
      render json: { errors: ["quantity must be greater than 0"] }, status: :unprocessable_entity
      return
    end

    if cart_item.product.quantity < params[:quantity].to_i
      render json: { errors: ["Insufficient stock: only #{cart_item.product.quantity} available"] }, status: :unprocessable_entity
      return
    end

    if cart_item.update(quantity: params[:quantity].to_i)
      render json: cart_response, status: :ok
    else
      render json: { errors: cart_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    cart_item = @cart.cart_items.find(params[:id])
    cart_item.destroy
    render json: cart_response, status: :ok
  end

  private

  def set_cart
    unless current_user.id == params[:user_id].to_i
      render json: { errors: ["Unauthorized"] }, status: :forbidden
      return
    end
    @cart = current_user.cart || current_user.create_cart!
  end

  def cart_response
    {
      cart: @cart.as_json(include: { cart_items: { include: { product: { methods: :image_urls } } } }),
      subtotal: @cart.subtotal
    }
  end
end
