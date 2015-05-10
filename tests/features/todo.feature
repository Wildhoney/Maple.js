@javascript
Feature: Todos
  In order to make my life easier
  As a person who wishes to manage their list
  I want to be able to add, remove, and mark as complete my todo items

  Scenario: Mark item one as complete
    Given I am on the home page
    And I mark item 1 as complete
    And I wait for 1 seconds
    Then I should see "1/ 3"