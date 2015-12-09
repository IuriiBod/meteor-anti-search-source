Template.staffCostTr.onCreated(function () {
  var tmpl = this;
  this.autorun(function () {
    var data = Template.currentData();
    tmpl.set('dailyStaff', data.figureBoxDataHelper.getDailyStaff(data.day));
  });
});

Template.staffCostTr.helpers({
  formatActual: function (dailyStaff) {
    return Math.round(dailyStaff.actual).toLocaleString();
  },

  formatForecast: function (dailyStaff) {
    return Math.round(dailyStaff.forecasted).toLocaleString();
  },

  textClass: function (dailyStaff) {
    if (dailyStaff.actual && dailyStaff.forecasted) {
      if (dailyStaff.actual <= dailyStaff.forecasted) {
        return "text-info";
      } else {
        return "text-danger";
      }
    }
  }
});


