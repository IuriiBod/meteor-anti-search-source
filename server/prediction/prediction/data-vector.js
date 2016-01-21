DataVector = class DataVector {
  constructor(dateMoment, weatherObject) {
    this.date = dateMoment;
    this.weather = weatherObject;
  }

  getTrainingData(dailySale) {
    return [this.getTestingData(), dailySale.actualQuantity];
  }

  getTestingData() {
    return [
      this.date.day() * 5, // Day of week (from 0 to 6)
      this.date.day() % 6 == 0 ? 10 : 0, // Is weekend
      Math.round(SunCalc.getMoonIllumination(this.date.toDate()).phase * 10), // Moon illumination (from 0 to 5)
      this.weather.temp, // Air temperature
      HospoHero.dateUtils.getWeatherNumericalRepresentation(this.weather.main), // Weather in numeric format
      this.weather.main, // Weather in numeric format
      HospoHero.dateUtils.getSeasonOfTheYear(this.date.format('MM')) // Season of the year
    ]
  }
};