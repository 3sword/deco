# encoding: UTF-8

require 'rubygems'
require 'sinatra'

set :environment, ENV['RACK_ENV'].to_sym
disable :run, :reload

require "./decoapp.rb"
run DecoApp.new
