Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  post "auth/telegram", to: "auth#telegram"
  get "me", to: "auth#me"
  patch "me", to: "auth#update"

  get "dashboard/stats", to: "dashboard#stats"
  get "shops/me", to: "shops#show"
  patch "shops/me", to: "shops#update"
  resources :shops, only: [ :create ]

  resources :orders, only: [ :index, :show ]

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
