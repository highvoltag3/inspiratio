class User < ActiveRecord::Base
  include LikesTracker

  has_many :ideas

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :name, :password, :password_confirmation, :remember_me

  acts_as_liker_for :ideas

  validates :email, presence: true, uniqueness: true

end
