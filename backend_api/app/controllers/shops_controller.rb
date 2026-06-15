class ShopsController < ApplicationController
  before_action :authenticate_user!, except: [ :show ]
  before_action :set_shop, only: [ :show, :update ]
  before_action :set_own_shop, only: [ :me, :update_me ]

  def show
    render json: @shop.api_json, status: :ok
  end

  def me
    render json: @own_shop.api_json, status: :ok
  end

  def create
    @shop = current_user.shop || current_user.build_shop
    @shop.assign_attributes(shop_params.except(:logo))
    @shop.logo.attach(shop_params[:logo]) if shop_params[:logo].present?

    if @shop.save
      render json: @shop.api_json, status: :created
    else
      render json: { errors: @shop.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @shop.update(shop_params.except(:logo))
      @shop.logo.attach(shop_params[:logo]) if shop_params[:logo].present?
      render json: @shop.api_json, status: :ok
    else
      render json: { errors: @shop.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update_me
    if @own_shop.update(shop_params.except(:logo))
      @own_shop.logo.attach(shop_params[:logo]) if shop_params[:logo].present?
      render json: @own_shop.api_json, status: :ok
    else
      render json: { errors: @own_shop.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_shop
    @shop = Shop.find_by(slug: params[:slug]) || Shop.find_by(id: params[:id])
    render json: { error: "Shop not found" }, status: :not_found unless @shop
  end

  def set_own_shop
    @own_shop = current_user.shop
    render json: { error: "Shop not found" }, status: :not_found unless @own_shop
  end

  def shop_params
    params.require(:shop).permit(
      :name,
      :slug,
      :category_id,
      :description,
      :email,
      :phone_code,
      :phone_number,
      :address,
      :country,
      :region,
      :city,
      :status,
      :logo
    )
  end
end
