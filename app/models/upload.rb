class Upload < ActiveRecord::Base
  belongs_to :idea

  attr_accessible :idea_id, :image

  has_attached_file :image,
    storage: :s3,
    s3_credentials: {
      access_key_id: APP_CONF[:aws][:key],
      secret_access_key: APP_CONF[:aws][:secret]
    },
    bucket: APP_CONF[:aws][:bucket],
    s3_permissions: :public_read,
    url: ':s3_domain_url',
    path: ":class/:id/:filename"

  # validates :idea_id, presence: true
  validates :image, presence: true

end
