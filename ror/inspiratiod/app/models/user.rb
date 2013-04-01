class User < ActiveRecord::Base
  attr_accessible :email, :password, :screenname
end
