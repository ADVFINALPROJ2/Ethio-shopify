Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  post "auth/telegram", to: "auth#telegram"
  get "me", to: "auth#me"

  resources :users
  resources :products do
    member do
      post :purchase
    end
  end

  get "cart" => "carts#show"
  resources :cart_items, only: [ :create, :update, :destroy ], path: "cart/items"
end
