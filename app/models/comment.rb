class Comment < ActiveRecord::Base
  attr_accessible :body, :user_id, :idea_id

  belongs_to :user
  belongs_to :idea

  validates :user_id, presence: true
  validates :idea, presence: true
  validates :body, presence: true
end
