source 'https://rubygems.org'
ruby '2.2.2'

gem 'sinatra'
gem 'sass'
gem 'memcachier'
gem 'dalli'

group :production do
  gem "unicorn"
  gem "thin" #needed for running prod
end

group :development do
  gem "thin" #for testing
  gem "shotgun"
end
