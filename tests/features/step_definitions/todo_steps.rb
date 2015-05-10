Given /^I am on the home page$/ do
  visit('/')
end

And /^I mark item (\d+) as complete$/ do |item|
  fill_in field, :with => item
end

Given /^I wait for (\d+) seconds?$/ do |n|
  sleep(n.to_i)
end

Then /^I should see "([^"]*)"$/ do |text|
  page.should have_content(text)
end