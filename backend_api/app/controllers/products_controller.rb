class ProductsController < ApplicationController
  before_action :set_product, only: [ :show, :update, :destroy, :purchase ]

  def index
    @products = Product.includes(:user).all
    render json: products_json(@products), status: :ok
  end

  def show
    render json: product_json(@product), status: :ok
  end

  def create
    @product = Product.new(product_params)

    if @product.save
      attach_images if params[:product][:images].present?
      render json: product_json(@product), status: :created
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @product.update(product_params)
      attach_images if params[:product][:images].present?
      render json: product_json(@product), status: :ok
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @product.images.purge
    @product.destroy
    head :no_content
  end

  def purchase
    quantity = params[:quantity].present? ? params[:quantity].to_i : 1

    if quantity <= 0
      render json: { errors: [ "Quantity must be greater than 0" ] }, status: :unprocessable_entity
      return
    end

    if @product.quantity < quantity
      render json: { errors: [ "Insufficient stock: only #{@product.quantity} available" ] }, status: :unprocessable_entity
      return
    end

    @product.decrement_stock!(quantity)
    render json: product_json(@product), status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def product_params
    params.require(:product).permit(:name, :description, :price, :quantity, :status, :user_id)
  end

  def attach_images
    images = params[:product][:images]
    images = images.values if images.is_a?(ActionController::Parameters)
    images = [ images ] unless images.is_a?(Array)
    images.each { |img| @product.images.attach(img) }
  end

  def product_json(product)
    product.as_json(include: { user: { only: [ :id, :username, :fullname ] } })
           .merge("image_urls" => product.image_urls)
  end

  def products_json(products)
    products.map { |p| product_json(p) }
  end
end
