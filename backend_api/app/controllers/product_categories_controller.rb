class ProductCategoriesController < ApplicationController
  before_action :authenticate_user!

  def index
    shop = current_user.shop

    categories = ProductCategory
      .where(category_id: shop.category_id)
      .select(:id, :name)

    render json: categories
  end
end
