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

    if product.quantity < params[:quantity].to_i
      render json: { errors: ["Insufficient stock: only #{product.quantity} available"] }, status: :unprocessable_entity
      return
    end

    cart_item = @cart.cart_items.find_or_initialize_by(product_id: params[:product_id])
    cart_item.quantity = (cart_item.quantity || 0) + params[:quantity].to_i

    if cart_item.save
      render json: cart_response, status: :created
    else
      render json: { errors: cart_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    cart_item = @cart.cart_items.find(params[:id])
    quantity = params[:quantity].to_i

    unless quantity > 0
      render json: { errors: ["quantity must be greater than 0"] }, status: :unprocessable_entity
      return
    end

    if cart_item.product.quantity < quantity
      render json: { errors: ["Insufficient stock"] },
             status: :unprocessable_entity
      return
    end

    if cart_item.update(quantity: quantity)
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
    @cart = current_user.cart || current_user.create_cart!
  end

  def cart_response
    cart_items = @cart.cart_items.includes(product: { images_attachments: :blob })
    subtotal = cart_items.sum { |item| item.quantity.to_i * item.product.price }
    item_count = cart_items.sum { |item| item.quantity.to_i }

    {
      cart: {
        id: @cart.id,
        user_id: @cart.user_id,
        cart_items: cart_items.map { |item|
          product = item.product
          {
            id: item.id,
            cart_id: item.cart_id,
            product_id: item.product_id,
            quantity: item.quantity,
            created_at: item.created_at,
            updated_at: item.updated_at,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              description: product.description,
              quantity: product.quantity,
              status: product.status,
              image_urls: product.image_urls
            }
          }
        }
      },
      subtotal: subtotal,
      item_count: item_count
    }
  end
end
