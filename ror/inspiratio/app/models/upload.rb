class Upload < ActiveRecord::Base
  belongs_to :idea

  attr_accessible :idea_id

  validates user_id: presence: true

end
