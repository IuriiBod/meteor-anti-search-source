Template.staffCostPercentagesTr.onCreated(function () {
  var tmpl = this;
  this.autorun(function () {
    var data = Template.currentData();
    tmpl.set('dailyStaff', data.figureBoxDataHelper.getDailyStaff(data.day));
  });
});

Template.staffCostPercentagesTr.helpers({
  actual: function () {
    return this.actualWage;
  },

  forecast: function () {
    return this.forecastedWage;
  },

  textClass: function () {
    if (this.actualWage != 0) {
      if (this.actualWage <= this.forecastedWage) {
        return "text-info";
      } else {
        return "text-danger";
      }
    }
  }
});
