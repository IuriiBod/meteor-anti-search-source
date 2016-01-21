//context: weekDate (WeekDate)
Template.weeklyFigures.onCreated(function () {
  var tmpl = this;

  this.autorun(function () {
    var data = Template.currentData();
    var staffCalculator = new StaffCostCalculator(data.date);
    console.log(staffCalculator);
    var figureBoxDataHelper = new FigureBoxDataHelper(data.date);
    tmpl.set('figureBoxDataHelper', figureBoxDataHelper);
  });
});

Template.weeklyFigures.helpers({
  weekDates: function () {
    return HospoHero.dateUtils.getWeekDays(this.date);
  }
});