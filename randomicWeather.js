module.exports = {

	now: function(provider) {
		var weatherInformation = [];
		var cities = ["Curitiba", "Maringa", "Londrina", "Foz do Iguacu", "Guarapuava"];
		var time = {
			HOUR: 23,
			MINUTES: 59,
			SECONDS: 59,
			MILLIS: 999
		};

		var sky = function(temperature) {
			var situation = ["weather-snowy", "weather-rainy", "weather-stormy", "weather-cloudy", "weather-cloudy-sunny", "weather-sunny"];
			if(temperature > 0 && (temperature % 6) == 0)
				return situation[temperature / 6]
		
			return temperature > 0 ? situation[temperature % 6] : situation[0];
		};

		var conditions = function(){
			var positive = Math.floor((Math.random() * 36) + 1);
			var negative = Math.floor((Math.random() * 6) + 1);
			var humidity = Math.floor((Math.random() * 100) + 1);
			var wind = Math.floor((Math.random() * 25) + 1);
			var preciptation = Math.floor((Math.random() * 100));
			var temperature = positive - negative;

			var termo = function() {
                if(temperature < 15)
                    return 'cold';
                if(temperature >= 15 && temperature < 28)
                    return 'good';
                else
                    return 'hot';
            };

			var condition = {"temperature": temperature, "humidity": humidity, "wind": wind, "preciptation": preciptation, "termo": termo()};

			return condition;
		};

		var today = new Date();

		var randonTime = function(limit) {
			var now = 0;

			switch(limit){
				case time.HOUR:
					now = today.getHours();
					break;
				case time.MINUTES:
					now = today.getMinutes();
					break;
				case time.SECONDS:
					now = today.getSeconds();
					break;
				default:
					now = 0;
			}

			var rand = Math.floor((Math.random() * limit));

			while(rand > now)
				rand = Math.floor((Math.random() * limit));

			return rand;
		};

		for (var i = 0; i < cities.length; i++) {
			var condition = conditions();
			var info = {
				"provider": provider,
				"city": cities[i],
				"temperature": condition.temperature,
				"humidity": condition.humidity,
				"sky": sky(condition.temperature),
				"wind": condition.wind,
				"preciptation": condition.preciptation,
				"termo": condition.termo,
				"update": new Date(today.getFullYear(), today.getMonth(), today.getDate(), randonTime(time.HOUR), randonTime(time.MINUTES), randonTime(time.SECONDS), Math.floor((Math.random() * 999)))
			};

			weatherInformation.push(info);
		}
		
		return weatherInformation;
	}
}