var staticServer = require('node-static');
var fs = require('fs');
var path = require('path');

var file = new (staticServer.Server)(path.resolve(__dirname, 'public'));

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
}).listen(8080);