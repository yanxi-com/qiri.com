
/*
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 */
 
var express = require('express'),
    config = require('./config').config,
    http = require('http'),
    fs = require('fs'),
    qiriError = require('./model/qiri-err'),
    routes = require('./routes/route'),
    accessLogfile = fs.createWriteStream(__dirname + '/var/logs/access.log', {flags: 'a'}),
    app = express(),
    path = require('path'),
    ejs = require('ejs');

ejs.open = '{%';
ejs.close = '%}';

app.configure(function() {
    app.set('port', config.port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
    app.use(express.logger({
        stream: accessLogfile,
        // http://www.senchalabs.org/connect/middleware-logger.html
        format: ":date :method :url :status :res[content-length] - :response-time ms :user-agent"
    }));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(config.cookieSecret));
  
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public'), {maxAge: 1000 * 3600 * 24 * 30}));
    app.use(qiriError.qiriErrorHandler);
    app.use(qiriError.errorHandler);
});

// home
app.get('*', function(req, res) {
    res.send(500, '维护中，请稍候再试!');
});
app.get(/^\/(|skincare|makeup|men|perfume|health)\/?$/, routes.channel);
app.get(/^\/(skincare|makeup|men|perfume|health)\/(.+)\/?$/, routes.products);
app.get(/^\/pimg\/(.*)$/, routes.showProductImage);

app.get('/product/:prodId', routes.product);

// management
app.all(/^\/manage\b/, routes.manage.checkLogin);

app.get('/manage', routes.manage.page);
app.get('/manage/category', routes.manage.category);
app.get('/manage/upload', routes.manage.upload);
app.get('/manage/products', routes.manage.products);
app.get('/manage/product', routes.manage.product);

app.post('/manage/login', routes.manage.login);
app.post('/manage/operation', routes.manage.operation);
app.post('/manage/upload', routes.manage.uploadFile);
app.post('/manage/product-image', routes.manage.postProductImage);

// 404
app.use(function(req, res, next) {
    res.status(404);
    res.render('error', {
        title : '页面不存在'
    });
});

app.locals({
    page : {},
    headTitle : ''
});

var server = http.createServer(app);
server.setMaxListeners(100);
server.listen(80, function() {
    console.log('Express server listening on port ' + app.get('port'));
});
