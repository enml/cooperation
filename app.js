var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;


(function () {
    var userOnLine = [];
    var userData = {
        "time": "",
        "msg": "",
        "avatar": "",
        "id": "",
    };

    function checkInArray(val, arr) {
        var flag = false,
            len = arr.length;
        while (len--) {
            if (arr[len - 1] === val) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    /*监听message*/
    io.on('connection', function (socket) {
        console.log(io.sockets)
        socket.on('avatar', function (msg) {
            if (checkInArray(msg, userOnLine)) {

            } else {
                userOnLine.push(msg);
            }
        });
        socket.on('chat message', function (clientData) {
            userData["msg"] = clientData["msg"];
            userData["avatar"] = clientData["avatar"]
            userData["id"] = clientData["id"];
            userData["time"] = getTime().time();
            io.emit('chat message', userData);
        });

        socket.on('image data', function (clientData) {
            userData["msg"] = clientData["msg"];
            userData["avatar"] = clientData["avatar"]
            userData["id"] = clientData["id"];
            userData["time"] = getTime().time();
            io.emit('image data', userData);
        });
        socket.on('cv', function (cvData) {
            io.emit('cv', cvData);
        });
        socket.on('doc message', function (clientData) {
            userData["msg"] = clientData["msg"];
            userData["avatar"] = clientData["avatar"]
            userData["id"] = clientData["id"];
            userData["time"] = {"num":getTime().num(),"time":getTime().time()};
            io.emit('doc message', userData);
        });

    })




    /*获取timestamp*/
    function getTime() {
        var date = new Date();

        function time() {
            return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        }

        function day() {
            return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate();
        }

        function num() {
            return date.getTime();
        }
        return {
            time: time,
            day: day,
            num: num,
            date:date
        }
    }
})();