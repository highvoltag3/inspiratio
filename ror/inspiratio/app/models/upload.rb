class Upload < ActiveRecord::Base
  belongs_to :idea

  attr_accessible :idea_id, :image

  has_attached_file :image
    # styles: { medium: "300x300>", thumb: "100x100>" },

  validates :user_id, presence: true

end
