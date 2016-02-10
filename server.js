var restify = require('restify');
var mongodb = require('mongodb');
var randomicWeather = require('./randomicWeather.js');

var server = restify.createServer();
var uri = 'mongodb://weather-provider:weather-provider@ds057954.mongolab.com:57954/weather'
var port = process.env.PORT || 9001;

server.use(restify.bodyParser({ mapParams: true }));

var weather = {};

weather.provider = function() {
	return "First Weather Provider";
};

weather.hello = function(req, res, next) {
	res.send('Hello ' + req.params['param'] + '!');
	next();
};

weather.now = function(req, res, next) {
    var user = {
        "email": req.body.email,
        "password": req.body.password
    };

    var params = {
        "callback": weather.find,
        "collection": 'users',
        "filter": user,
        "response": res
    };

    weather.dbOperations(params);
    next();
};

weather.find = function(params) {
    var collection = params.db.collection(params.collection);
    collection.find(params.filter).toArray(function(err, docs) {
        if(err) {
            console.log('Error...');
            params.response.json(err);
            return;
        }

        if(docs.length > 0)
        	params.response.json(randomicWeather.now(weather.provider()));

        return;
    });
};

weather.register = function(req, res, next) {
	var user = {
        "email": req.params['email'],
        "password": req.params['password']
    };

    var params = {
        "collection": 'users',
        "response": res,
        "callback": saveUser,
        "request": req,
        "user": user
    };

    weather.dbOperations(params);
    next();
};

weather.dbOperations = function(params) {
	console.log('operations');
    mongodb.MongoClient.connect(uri, function(err, db) {

        if(err){
        	console.log('error' + err);
        	throw err;
        }

        params.db = db;

        if(params.callback)
        	params.callback(params);
    });
};

server.get('/hello/:param', weather.hello);
server.get('/register/:email/:password', weather.register);
server.post('/weather', weather.now);

server.listen(port, function() {
  console.log('%s listening at server port %s', 'Weather Info', port);
});

var saveUser = function(params) {
	var collection = params.db.collection(params.collection);

    try {
        collection.insert(params.user);
        params.response.json({"insert": true});
    } catch(ex) {
        params.response.json({"insert": false, "err": "Error on trying to save the user."});
    }
};