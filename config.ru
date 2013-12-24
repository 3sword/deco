# encoding: UTF-8

require 'rubygems'
require 'sinatra'

use Rack::Session::Cookie, :key => 'rack.session',
                           :path => '/',
                           :expire_after => 2592000,
                           :secret => 'worksap'

require "./decoapp.rb"
run DecoApp.new
