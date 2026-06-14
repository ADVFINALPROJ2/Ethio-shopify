class ShopsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_shop, only: [ :show, :update ]

  def show
    render json: @shop.api_json, status: :ok
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

  private

  def set_shop
    @shop = current_user.shop
    render json: { error: "Shop not found" }, status: :not_found unless @shop
  end

  def shop_params
    params.require(:shop).permit(
      :name,
      :category,
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
