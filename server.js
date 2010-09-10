//setup Dependencies


var connect = require('connect')
    , express = require('express')
    , sys = require('sys')
    , port = 8080;

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.use(connect.bodyDecoder());
    server.use(connect.staticProvider(__dirname ));
    server.use(server.router);
});

server.listen(port);

