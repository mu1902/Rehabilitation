var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path")
var mime = require("./code/mime").types;
var config = require("./code/config").config;
var router = require("./code/router").router;

var log4js = require("log4js");
log4js.configure("./logs/config.json");
var logger_file = log4js.getLogger('log_file');
var logger_date = log4js.getLogger('log_date');

var port = 8888;

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;

    if (pathname.slice(-1) === '/') {
        pathname = pathname + config.Welcome;
    }

    var realPath = __dirname + "/public" + pathname;

    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    var contentType = mime[ext] || 'text/plain';

    if (ext == 'unknown') {                              //ajax请求
        router[pathname](request, response);
    } else {                                             //静态请求
        fs.exists(realPath, function (exists) {
            if (!exists) {
                response.writeHead(404, {
                    'Content-Type': 'text/html'
                });

                response.end();
            } else {
                fs.readFile(realPath, "binary", function (err, file) {
                    if (err) {
                        response.writeHead(500, {
                            'Content-Type': 'text/html'
                        });

                        response.end(err);
                    } else {
                        response.writeHead(200, {
                            'Content-Type': contentType
                        });

                        response.write(file, "binary");
                        response.end();
                    }
                });
            }
        });
    }
});

server.listen(port);

console.log("Server runing at port: " + port + ".");
