class UsersController < ApplicationController

  # GET /users
  def index
    @users = User.all
    
    # Sends the users data as JSON to your React frontend
    render json: @users, status: :ok
  end

  # POST /users
  def create
    @user = User.new(user_params)

    if @user.save
      # If successful, returns the created user data and a 201 Created status
      render json: @user, status: :created
    else
      # If it fails validations, returns the error messages so React can display them
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :fullname, :phone_number)
  end
end
