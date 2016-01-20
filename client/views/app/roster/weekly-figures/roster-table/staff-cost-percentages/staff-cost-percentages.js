Template.staffCostPercentagesTr.onCreated(function () {
  this.dailyStaff = new ReactiveVar(false);
  var tmpl = this;
  this.autorun(function () {
    var data = Template.currentData();
    var dailyStaff = data.figureBoxDataHelper.getDailyStaff(data.day);
    tmpl.dailyStaff.set('dailyStaff', dailyStaff);
  });
});

Template.staffCostPercentagesTr.helpers({
  dailyStaff: function () {
    return Template.instance().dailyStaff.get();
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
