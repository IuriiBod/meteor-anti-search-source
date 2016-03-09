DataVector = class DataVector {
  constructor(dateMoment, weatherObject) {
    this.date = dateMoment;
    this.weather = weatherObject;
  }

  getTrainingData(dailySale) {
    var result = this.getTestingData();
    result.unshift(dailySale.actualQuantity);
    return result;
  }

  getTestingData() {
    let weekday = this.date.weekday();
    return [
      this.date.format('ddd'),
      weekday === 6 || weekday === 5 ? 'yes' : 'no',
      Math.round(SunCalc.getMoonIllumination(this.date.toDate()).phase * 10),
      this.weather.temp,
      this._getSimplifiedWeatherDescription()
    ];
  }

  _getSeasonOfTheYear() {
    let month = this.date.format('MM');
    let seasons = ['Winter', 'Winter',
      'Spring', 'Spring', 'Spring',
      'Summer', 'Summer', 'Summer',
      'Fall', 'Fall', 'Fall',
      'Winter'];
    return seasons[parseInt(month) - 1];
  }

  _getSimplifiedWeatherDescription() {
    let weatherRepresentation = 'none';
    switch (this.weather.main) {
      case "Moderate or heavy snow in area with thunder":
      case "Patchy light snow in area with thunder":
      case "Blowing snow":
      case "Heavy snow":
      case "Moderate or heavy sleet showers":
      case "Moderate or heavy snow showers":
      case "Moderate or heavy showers of ice pellets":
      case "Ice pellets":
      case "Patchy moderate snow":
      case "Light snow showers":
      case "Light sleet showers":
      case "Light showers of ice pellets":
      case "Patchy light snow":
      case "Moderate or heavy sleet":
      case "Blizzard":
      case "Moderate snow":
      case "Patchy snow nearby":
      case "Light snow":
      case "Patchy sleet nearby":
      case "Patchy heavy snow":
        weatherRepresentation = 'snow';
        break;

      case "Heavy rain":
      case "Heavy rain at times":
      case "Moderate or heavy rain in area with thunder":
      case "Patchy light rain in area with thunder":
      case "Moderate or Heavy freezing rain":
      case "Heavy freezing drizzle":
      case "Torrential rain shower":
      case "Moderate or heavy rain shower":
      case "Thundery outbreaks in nearby":
      case "Light rain shower":
      case "Light freezing rain":
      case "Moderate rain":
      case "Light rain":
      case "Freezing drizzle":
      case "Light drizzle":
      case "Patchy freezing drizzle nearby":
      case "Light sleet":
      case "Patchy light rain":
      case "Patchy light drizzle":
      case "Patchy rain nearby":
      case "Moderate rain at times":
        weatherRepresentation = 'rain';
        break;

      case "Fog":
      case "Freezing fog":
      case "Mist":
        weatherRepresentation = 'fog';
        break;

      case "Overcast":
      case "Cloudy":
      case "Partly Cloudy":
        weatherRepresentation = 'clouds';
        break;

      case "Clear":
      case "Clear/Sunny":
      case "Sunny":
        weatherRepresentation = 'sunny';
        break;
      default:
        weatherRepresentation = 'sunny';
        break;
    }

    return weatherRepresentation;
  }
};


