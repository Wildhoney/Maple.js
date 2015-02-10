(function main($maple) {

    describe('Maple', function() {

        describe('Modules', function() {

            it('Should be able to register a module;', function() {

                var app = $maple.createModule('myApp', []);
                expect($maple._modules.myApp).toBeDefined();
                expect(app).toEqual($maple.createModule('myApp'));

                expect(typeof app.name).toBe('string');
                expect(app.name).toEqual('myApp');
                expect(typeof app.dependencies).toBe('object');

                // App that doesn't exist yet.
                expect(function() {
                    $maple.createModule('myExtinctApp');
                }).toThrow('Maple: Module "myExtinctApp" does not exist.');

                // App with three dependencies.
                expect($maple.createModule('myOtherApp', [1, 2, 3]).dependencies.length).toEqual(3);

                // App that is trying to overwrite an existing app.
                expect(function() {
                    $maple.createModule('myApp', []);
                }).toThrow('Maple: Module "myApp" has already been registered.');

            });

        });

        describe('Templates', function() {

            var app = {};

            beforeEach(function() {
                app = $maple.createModule('templateApp', []);
            });

            it('Should be able to initialise a new template;', function() {

                expect(app.templates.calendar).toBeUndefined();

                var templateElement = document.createElement('template');
                var template        = app.renderTemplate('calendar', templateElement);

                expect(template.toString()).toEqual('[object MapleTemplate]');
                expect(template.name).toEqual('calendar');
                expect(template.element).toEqual(templateElement);
                expect(app.templates.calendar).toBeDefined();

                // Invalid view because element is not a `template` element.
                expect(function() {
                    app.renderTemplate('calendar', document.createElement('section'));
                }).toThrow('Maple: Templates must be rendered in `template` elements.');

            });

        });

    });

})(window.maple);