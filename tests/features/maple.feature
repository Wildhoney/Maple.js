Feature: User can manage their Todo List

  Scenario: Todo item marked as complete
    Given I have a list of todo items
    When I mark item 2 as complete
    Then Item 2 is marked as complete