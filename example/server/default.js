(function($process) {

    "use strict";

    var express = require('express'),
        app     = express(),
        colour  = require('cli-color'),
        pad     = require('pad'),
        server  = require('http').createServer(app),
        port    = ($process.env.PORT || 5000);

    app.use(express.static(__dirname + '/..'));
    server.listen(port);

	var header = colour.xterm(231).bgXterm(161),
		yellow = colour.xterm(221).bgXterm(232);

    console.log(header(' Maple.js:', yellow(' Running on port ' + port)));

})(process);