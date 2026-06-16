class CategoriesController < ApplicationController
  def index
    render json: Category.all.select(:id, :name)
  end
end
