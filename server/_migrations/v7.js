Migrations.add({
  version: 7,
  name: "forecastDates improving",
  up: function(){
    ForecastDates.update({},{$rename: {"lastThree": "lastThreeDays"}, $unset:{lastOne:""}}, {multi: true});
  }
});