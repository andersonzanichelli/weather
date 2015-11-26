var restify = require('restify');
var mongodb = require('mongodb');

var server = restify.createServer();
var uri = 'mongodb://weather-provider:weather-provider@ds057954.mongolab.com:57954/weather'
var port = process.env.PORT || 9001;

server.use(restify.bodyParser({ mapParams: true }));

var weather = {};

var randomicWeather = function() {

	var sky = function(temperature) {
		var situation = ["weather-snowy", "weather-rainy", "weather-stormy", "weather-cloudy", "weather-cloudy-sunny", "weather-sunny"];
		if(temperature > 0 && (temperature % 6) == 0)
			return situation[temperature / 6]
	
		return temperature > 0 ? situation[temperature % 6] : situation[0];
	}

	var city = function() {
		var cities = ["Curitiba", "Maringá", "Londrina", "Foz do Iguaçu", "Guarapuava"];
		var chosen = Math.floor((Math.random() * 5) + 1);

		return cities[chosen - 1];
	}

	var positive = Math.floor((Math.random() * 36) + 1);
	var negative = Math.floor((Math.random() * 6) + 1);
	var humidity = Math.floor((Math.random() * 100) + 1);

	var temperature = positive - negative;
	
	var info = {
		"city": city(),
		"temperature": temperature,
		"Humidity": humidity,
		"sky": sky(temperature),
		"update": new Date()
	};

	return info;
}

weather.hello = function(req, res, next) {
	res.send('Hello ' + req.params['param'] + '!');
	next();
}

weather.now = function(req, res, next) {
	var date = new Date();
    var minutes = date.getMinutes();

    if(minutes % 6 === 0)
		res.json(randomicWeather());

	next();
}

server.get('/hello/:param', weather.hello);
server.get('/weather', weather.now);


server.listen(port, function() {
  console.log('%s listening at server port %s', 'Weather Info', port);
});