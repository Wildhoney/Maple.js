(function main($maple) {

    describe('Maple', function() {

        describe('Function: module', function() {

            it('Should be able to register a module', function() {

                var app = $maple.module('myApp', []);
                expect($maple._modules.myApp).toBeDefined();
                expect(app).toEqual($maple.module('myApp'));

                expect(function() {
                    $maple.module('myExtinctApp');
                }).toThrow('Maple: Module "myExtinctApp" does not exist.');

            });

        });

    });

})(window.maple);