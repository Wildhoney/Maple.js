require 'rubygems'
require 'cucumber'
require 'cucumber/rake/task'

task :default => 'features'

Cucumber::Rake::Task.new(:features) do |t|
  t.cucumber_opts = "--format pretty" # Any valid command line option can go here.
end