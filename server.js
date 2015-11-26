var restify = require('restify');
var mongodb = require('mongodb');

var server = restify.createServer();
var uri = 'mongodb://weather-provider:weather-provider@ds057954.mongolab.com:57954/weather'
var port = process.env.PORT || 9001;

server.use(restify.bodyParser({ mapParams: true }));

var weather = {};

weather.hello = function(req, res, next) {
	res.send('Hello ' + req.params['person'] + '!');
	next();
}

server.get('/hello/:person', weather.hello);

server.listen(port, function() {
  console.log('%s listening at server port %s', 'Weather Info', port);
});