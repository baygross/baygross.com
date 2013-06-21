#shotgun ./app.rb -p 3000

#dependencies
require "rubygems"
require "bundler"
Bundler.require :default, (ENV["RACK_ENV"] || "development").to_sym

# initialize cache
if ENV["RACK_ENV"] == 'production'
  CACHE = Dalli::Client.new
else
  #/usr/bin/memcached -p 11211
  options = { :namespace => "baygross.com", :compress => true }
  CACHE = Dalli::Client.new('localhost:11211', options)
end

#include routes
require File.join(File.dirname(__FILE__), 'routes')
