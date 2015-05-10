begin require 'rspec/expectations'; rescue LoadError; require 'spec/expectations'; end
require 'capybara'
require 'capybara/dsl'
require 'capybara/cucumber'
require 'capybara-webkit'
Capybara.default_driver = :selenium
Capybara.app_host = 'http://maple-app.herokuapp.com/'

#After do |scenario|
#  save_and_open_page if scenario.failed?
#end

World(Capybara)