var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var stream = require('./lib/streamio')
var app = express()
  , server = require('http').createServer(app)
	, log = require('nodeutil').logger.getInstance('app.js')

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * Serve a steam media
 */
app.get('/video/:type/:file', function(req, res) {
  log.info('Play stream file:%s with type:%s', req.params.file, req.params.type);
  stream.getResponse(res, req.params.file, 'video/' + req.params.type);
});

app.get('/video/status', function(req, res){
	res.send(stream.status);
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
