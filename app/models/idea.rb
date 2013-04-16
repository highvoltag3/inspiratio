class Idea < ActiveRecord::Base
	belongs_to :user
  has_many :uploads, dependent: :destroy

	attr_accessible :user_id, :title, :description, :tag_list, :uploads_attributes

  acts_as_taggable # add tags

  accepts_nested_attributes_for :uploads, allow_destroy: true

  validates :user_id, presence: true
  validates :title, presence: true
  validates :description, presence: true

  def current_image
    self.uploads.last
  end

  def old_images
    images = self.uploads
    images.pop
    images
  end

end
