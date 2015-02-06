(function main() {

    describe('Modules', function() {

        it('Should be able to emit an event;', function() {

            var component = maple.component('example'),
                events    = maple.events(),
                userModel = { username: 'Wildhoney', firstName: 'Adam', surname: 'Timberlake' };

            component.registerUser(userModel);
            expect(events.sent.length).toEqual(1);

            var event = events.sent[0];
            expect(event.name).toEqual('register_user');
            expect(event.params[0]).toEqual(userModel);

        });

        it('Should be able to receive an event and invoke a function;', function() {

            var component = maple.component('example'),
                events    = maple.events();

            spyOn(component, 'signOut');
            events.emit('logout_user', { name: 'Wildhoney' });
            expect(component.signOut).toHaveBeenCalled();

        });

    });

})();