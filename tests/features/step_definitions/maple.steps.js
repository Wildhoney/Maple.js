addStepDefinitions(function(scenario) {

    scenario.Given(/^I have a list of todo items$/, function (callback) {
        callback();
    });

    scenario.When(/^I mark item (\d+) as complete$/, function (arg1, callback) {
        callback();
    });

    scenario.Then(/^Item (\d+) is marked as complete$/, function (arg1, callback) {
        callback();
    });

});