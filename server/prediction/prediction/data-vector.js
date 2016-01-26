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
      this.date.weekday() * 5,
      this.date.weekday() % 6 == 0 ? 'yes' : 'no',
      Math.round(SunCalc.getMoonIllumination(this.date.toDate()).phase * 10),
      this.weather.temp,
      HospoHero.misc.simplifyWeatherDescription(this.weather.main),
      HospoHero.dateUtils.getSeasonOfTheYear(this.date.format('MM'))
    ]
  }
};