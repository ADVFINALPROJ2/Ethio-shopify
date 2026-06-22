class Shop < ApplicationRecord
  belongs_to :owner, class_name: "User"
  belongs_to :category
  has_many :products, dependent: :nullify
  has_one_attached :logo

  validates :name, presence: true
  validates :slug, uniqueness: true, allow_blank: true
  validates :category_id, presence: true
  before_validation :generate_slug, if: -> { name_changed? || slug.blank? }

  def logo_url
    return unless logo.attached?

    Rails.application.routes.url_helpers.rails_blob_url(logo)
  end

  def telegram_url
    "https://t.me/EthShopify_bot?startapp=shop_#{slug}"
  end

  def api_json
    as_json(
      except: [ :created_at, :updated_at ],
      include: {
        products: {
          except: [ :created_at, :updated_at ],
          methods: [ :image_urls ],
          include: { product_category: { only: [:id, :name] } }
        }
      }
    ).merge(
      "logo_url" => logo_url,
      "telegram_url" => telegram_url
    )
  end

  private

  def generate_slug
    base = name.parameterize
    candidate = base
    suffix = 2
    while self.class.where(slug: candidate).where.not(id: id).exists?
      candidate = "#{base}-#{suffix}"
      suffix += 1
    end
    self.slug = candidate
  end
end
