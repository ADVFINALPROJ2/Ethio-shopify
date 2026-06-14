class Shop < ApplicationRecord
  belongs_to :user
  has_many :products, dependent: :nullify
  has_one_attached :logo

  validates :name, presence: true

  def logo_url
    return unless logo.attached?

    Rails.application.routes.url_helpers.rails_blob_url(logo, only_path: true)
  end

  def api_json
    as_json(except: [ :created_at, :updated_at ]).merge("logo_url" => logo_url)
  end
end
