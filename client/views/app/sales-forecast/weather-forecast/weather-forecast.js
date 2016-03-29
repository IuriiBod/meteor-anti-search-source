Template.weatherForecast.helpers({
  hasForecast: function () {
    return !!Template.instance().data;
  },
  roundedTemperature: function () {
    return Math.round(this.temp);
  },
  iconClass: function () {
    return WeatherIcons[this.main.trim()];
  }
});

var WeatherIcons = {
  "Moderate or heavy snow in area with thunder": 'wi wi-day-snow-thunderstorm',
  "Patchy light snow in area with thunder": 'wi wi-day-snow-thunderstorm',
  "Moderate or heavy rain in area with thunder": 'wi wi-thunderstorm',
  "Patchy light rain in area with thunder": 'wi wi-storm-showers',
  "Moderate or heavy showers of ice pellets": 'wi wi-snow',
  "Light showers of ice pellets": 'wi wi-snow',
  "Moderate or heavy snow showers": 'wi wi-snow-wind',
  "Light snow showers": 'wi wi-snow-wind',
  "Moderate or heavy sleet showers": 'wi wi-sleet',
  "Light sleet showers": 'wi wi-sleet',
  "Torrential rain shower": 'wi wi-showers',
  "Moderate or heavy rain shower": 'wi wi-showers',
  "Light rain shower": 'wi wi-showers',
  "Ice pellets": 'wi wi-snowflake-cold',
  "Heavy snow": 'wi wi-snow-wind',
  "Patchy heavy snow": 'wi wi-snow-wind',
  "Moderate snow": 'wi wi-snow-wind',
  "Patchy moderate snow": 'wi wi-snow-wind',
  "Light snow": 'wi wi-snow',
  "Patchy light snow": 'wi wi-snow',
  "Moderate or heavy sleet": 'wi wi-sleet',
  "Light sleet": 'wi wi-sleet',
  "Moderate or Heavy freezing rain": 'wi wi-rain-mix',
  "Light freezing rain": 'wi wi-rain-mix',
  "Heavy rain": 'wi wi-rain',
  "Heavy rain at times": 'wi wi-rain',
  "Moderate rain": 'wi wi-rain',
  "Moderate rain at times": 'wi wi-rain',
  "Light rain": 'wi wi-showers',
  "Patchy light rain": 'wi wi-showers',
  "Heavy freezing drizzle": 'wi wi-rain',
  "Freezing drizzle": 'wi wi-sleet',
  "Light drizzle": 'wi wi-day-showers',
  "Patchy light drizzle": 'wi wi-day-showers',
  "Freezing fog": 'wi wi-fog',
  "Fog": 'wi wi-fog',
  "Blizzard": 'wi wi-snowflake-cold',
  "Blowing snow": 'wi wi-snow-wind',
  "Thundery outbreaks in nearby": 'wi wi-night-lightning',
  "Patchy freezing drizzle nearby": 'wi wi-showers',
  "Patchy sleet nearby": 'wi wi-sleet',
  "Patchy snow nearby": 'wi wi-snow',
  "Patchy rain nearby": 'wi wi-showers',
  "Mist": 'wi wi-fog',
  "Overcast": 'wi wi-cloudy',
  "Cloudy": 'wi wi-cloud',
  "Partly Cloudy": 'wi wi-day-cloudy',
  "Clear": 'wi wi-day-sunny',
  "Clear/Sunny": 'wi wi-day-sunny',
  "Sunny": 'wi wi-day-sunny'
};