Template.navForecast.helpers({
  year: function () {
    return moment().year();
  },
  week: function () {
    return moment().week();
  }
});