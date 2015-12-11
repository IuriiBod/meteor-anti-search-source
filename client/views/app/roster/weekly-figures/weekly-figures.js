//context: weekDate (WeekDate)
Template.weeklyFigures.onCreated(function () {
  var tmpl = this;

  this.autorun(function () {
    var data = Template.currentData();
    var figureBoxDataHelper = new FigureBoxDataHelper(data.weekDate);
    tmpl.set('figureBoxDataHelper', figureBoxDataHelper);
  });
});

Template.weeklyFigures.helpers({
  weekDates: function () {
    return HospoHero.dateUtils.getWeekDays(this.weekDate);
  }
});