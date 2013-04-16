Wordnik.configure do |config|
  config.api_key = 'e22c18406c64c389fe4000964950f380a3474965ab180be08'               # required
  config.username = 'highvoltag3'                    # optional, but needed for user-related functions
  config.password = 'ADNJ1807'               # optional, but needed for user-related functions
  config.response_format = 'json'             # defaults to json, but xml is also supported
  config.logger = Logger.new('/dev/null')     # defaults to Rails.logger or Logger.new(STDOUT). Set to Logger.new('/dev/null') to disable logging.
end