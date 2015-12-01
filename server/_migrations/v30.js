Migrations.add({
  version: 30,
  name: "Remove redundant weather forecasts",
  up: function () {
    //set all date properties to start of day
    Locations.find({}).forEach(function (location) {
      WeatherForecast.find({locationId: location._id}, {sort: {date: 1, updatedAt: -1}}).forEach(function (forecast) {
        var newDate = HospoHero.dateUtils.getDateMomentForLocation(forecast.date, location).startOf('day').toDate();
        WeatherForecast.update({_id: forecast._id}, {
          $set: {
            date: newDate
          }
        })
      });
    });

    //clean up repeated redundant recasts
    Locations.find({}).forEach(function (location) {
      WeatherForecast.find({locationId: location._id}, {sort: {date: 1, updatedAt: -1}}).forEach(function (forecast) {
        var dailyCount = WeatherForecast.find({
          locationId: location._id,
          date: TimeRangeQueryBuilder.forDay(forecast.date, location)
        }).count();

        if (dailyCount > 1) {
          WeatherForecast.remove({
            locationId: location._id,
            date: TimeRangeQueryBuilder.forDay(forecast.date, location),
            _id: {$ne: forecast._id}
          });
        }
      });
    });
  }
});