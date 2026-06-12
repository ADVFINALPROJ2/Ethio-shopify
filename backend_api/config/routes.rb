Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  resources :users
  resources :products do
    member do
      post :purchase
    end
  end

  get "cart" => "carts#show"
  resources :cart_items, only: [ :create, :update, :destroy ], path: "cart/items"
end
