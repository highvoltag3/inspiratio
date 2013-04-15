class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :name, :password, :password_confirmation, :remember_me
  # attr_accessible :title, :body

  #dario added validation
  validates :email, :presence => true, :uniqueness => true

  has_many :ideas, :inverse_of => :users
  
  #paperclip
  attr_accessible :user_id, :location
  
end
