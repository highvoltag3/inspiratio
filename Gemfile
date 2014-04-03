source 'https://rubygems.org'

gem 'rails', '3.2.13'

# main features
#
gem 'devise' # authentication
gem "paperclip", "~> 3.4.1" # uploads
gem 'aws-sdk' # access s3 with paperclip
gem 'fog', '~> 1.5.0' # access s3 files
gem 'acts-as-taggable-on' # tags
gem 'redis', '~> 3.0.1'
gem 'likes_tracker' # track likes

# deploy on heroku
#
gem 'thin'  # web server
#gem 'heroku' #this is now heroku toolbet, so Gem is deprecated.
gem 'foreman' # launcher (mainly for heroku)

# external APIs
#
gem 'gravatar_image_tag' # gravatar support
gem 'imagga' # extract color palette from images
gem 'cloudinary' # extract color palette from images
gem 'wordnik' # wordnik (fetch meaning of words)
gem 'flickr_fu' # flickr

# etc...
#
gem 'jquery-rails' # jQuery bindings for rails actions

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  # gem 'therubyracer', :platforms => :ruby

  gem 'uglifier', '>= 1.0.3'
end

group :production do
  gem 'pg' # postgresql db
  gem 'newrelic_rpm'
end

group :development do
  gem 'mysql2' # database
  gem "nifty-generators" # layout/helpers generators
  gem "quiet_assets"
  gem "ruby-debug19"
end
