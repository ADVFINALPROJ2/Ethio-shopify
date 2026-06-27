class ProductsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_product, only: [ :show, :update, :destroy, :orders, :restock ]
  before_action :set_public_product, only: [ :purchase ]
  before_action :set_storefront_product, only: [ :storefront_show ]

  def index
    @products = current_user.products.includes(:user, images_attachments: :blob).order(created_at: :desc)
    render json: products_json(@products), status: :ok
  end

  def show
    render json: product_json(@product), status: :ok
  end

  def storefront_show
    render json: public_product_json(@product), status: :ok
  end

  def create
    @product = current_user.products.new(product_params)
    @product.shop = current_user.shop if current_user.shop.present?

    if @product.save
      attach_images if params.dig(:product, :images).present?
      render json: product_json(@product), status: :created
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @product.update(product_params)
      attach_images if params.dig(:product, :images).present?
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
  rescue ActiveRecord::RecordInvalid
    render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
  end

  def orders
    items = @product.order_items.includes(order: :user)
                    .joins(:order)
                    .where(orders: { seller_id: current_user.id })
                    .order(created_at: :desc)

    render json: items.map { |item| product_order_json(item) }, status: :ok
  end

  def restock
    quantity = params[:quantity].present? ? params[:quantity].to_i : 0

    if quantity <= 0
      render json: { errors: [ "Restock quantity must be greater than 0" ] }, status: :unprocessable_entity
      return
    end

    @product.increment_stock!(quantity)
    render json: product_json(@product), status: :ok
  rescue ActiveRecord::RecordInvalid
    render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
  end

  def destroy_image
    @product = current_user.products.find(params[:product_id])
    @product.images.find(params[:id]).purge
    head :no_content
  end

  private

  def set_product
    @product = current_user.products.includes(images_attachments: :blob).find(params[:id])
  end

  def set_public_product
    @product = Product.find(params[:id])
  end

  def set_storefront_product
    shop = Shop.find_by!(slug: params[:slug])
    @product = shop.products.includes(images_attachments: :blob, product_category: :category)
                   .where(status: "active")
                   .find(params[:id])
  end

  def product_params
    params.require(:product).permit(:name, :description, :price, :quantity, :status, :low_stock_threshold, :product_category_id)
  end

  def attach_images
    images = params[:product][:images]
    images = images.values if images.is_a?(ActionController::Parameters)
    images = [ images ] unless images.is_a?(Array)
    images.each { |img| @product.images.attach(img) }
  end

  def product_json(product)
    product.as_json(include: { user: { only: [ :id, :username, :fullname ] } })
           .merge(
             "image_urls" => product.image_urls,
             "images" => product.images.map { |img| { id: img.id, url: product_image_url(img) } },
             "product_category_name" => product.product_category&.name,
             "total_sold" => product.order_items.joins(:order).where(orders: { seller_id: current_user.id }).sum(:quantity),
             "total_revenue" => product.order_items.joins(:order).where(orders: { seller_id: current_user.id }).sum("order_items.quantity * order_items.price").to_s
           )
  end

  def public_product_json(product)
    {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      status: product.status,
      image_urls: product.image_urls,
      images: product.images.map { |img| { id: img.id, url: product_image_url(img) } },
      product_category: product.product_category&.as_json(only: [ :id, :name ]),
      product_category_name: product.product_category&.name,
      shop: {
        id: product.shop&.id,
        name: product.shop&.name,
        slug: product.shop&.slug
      }
    }
  end

  def product_image_url(image)
    Rails.application.routes.url_helpers.rails_storage_proxy_url(image)
  end

  def products_json(products)
    products.map { |p| product_json(p) }
  end

  def product_order_json(item)
    order = item.order
    {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      total: order.total || (item.price || 0).to_d * item.quantity.to_i,
      customer_name: order.customer_name || order.user&.fullname || order.user&.username,
      created_at: order.created_at,
      quantity: item.quantity,
      price: item.price
    }
  end
end
