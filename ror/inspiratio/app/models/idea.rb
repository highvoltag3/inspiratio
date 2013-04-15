class Idea < ActiveRecord::Base
	belongs_to :user
  has_many :ideas

	attr_accessible :user_id, :title, :description, :tag_list

  acts_as_taggable # add tags

  validates :user_id, presence: true
  validates :title, presence: true
  validates :description, presence: true

end
