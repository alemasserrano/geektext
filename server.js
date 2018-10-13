var http = require('http');
var express = require('express');
var fs = require('fs');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('GeekBooks');
}).listen(8080);
