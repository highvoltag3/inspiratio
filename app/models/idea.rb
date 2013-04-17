class Idea < ActiveRecord::Base
  include LikesTracker

	belongs_to :user
  has_many :uploads, dependent: :destroy
  has_many :comments, dependent: :destroy

	attr_accessible :user_id,
    :title,
    :description,
    :tag_list,
    :uploads_attributes,
    :location

  acts_as_taggable # add tags
  acts_as_liked_by :users

  accepts_nested_attributes_for :uploads, allow_destroy: true

  validates :user_id, presence: true
  validates :title, presence: true
  validates :description, presence: true

  scope :order_by_likes, ->(limit=10, offset=0) {
    most_liked(limit, offset) do |model, ids|
      model.limit(limit).offset(offset).order(ids.map {|id| "id = #{id} DESC"}.join(',')) #if !ids.empty?
    end
  }

  def current_image
    self.uploads.first
  end

  def old_images
    self.uploads.where(Upload.arel_table[:id].not_eq(self.current_image.id))
  end

  def flickr_photos
    @flickr_photos ||= FLICKR_CLIENT.photos.search(text: self.title, per_page: 10)
  end

end
