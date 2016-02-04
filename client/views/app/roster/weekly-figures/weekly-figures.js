//context: date (Date)
Template.weeklyFigures.onCreated(function () {
  this.weekFigures = new ReactiveVar(false);
  this.totalFigures = new ReactiveVar(false);
  var tmpl = this;

  this.autorun(function () {
    var data = Template.currentData();
    var staffCalculator = new StaffCostCalculator(data.date);
    tmpl.weekFigures.set(staffCalculator.getWeekFigures());
    tmpl.totalFigures.set(staffCalculator.getTotalFigures());
  });
});

Template.weeklyFigures.helpers({
  weekFigures: function () {
    return Template.instance().weekFigures.get();
  },
  totalFigures: function () {
    return Template.instance().totalFigures.get();
  }
});