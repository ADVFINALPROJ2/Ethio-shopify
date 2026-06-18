Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  post "auth/telegram", to: "auth#telegram"
  get "me", to: "auth#me"
  patch "me", to: "auth#update"

  get "dashboard/stats", to: "dashboard#stats"
  get "shops/me", to: "shops#me"
  patch "shops/me", to: "shops#update_me"
  resources :shops, only: [ :create, :update ]
  get "shops/:slug", to: "shops#show"

  resources :orders, only: [ :index, :show ]
  resources :categories, only: [:index]
  resources :product_categories, only: [:index]

  resources :users
  resources :products do
    member do
      post :purchase
      get :orders
    end
  end

  get "cart" => "carts#show"
  resources :cart_items, only: [ :create, :update, :destroy ], path: "cart/items"
end
