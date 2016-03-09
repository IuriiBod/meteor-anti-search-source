//context: weekDate (WeekDate), type ('template'/null)

Template.weeklyShiftRoster.onCreated(function () {
  this.shiftBuffer = new ReactiveVar(null);
});

Template.weeklyShiftRoster.helpers({
  datesOfWeek: function () {
    var weekDate = this.type !== 'template' ? moment(this.date) : moment(0).week(2).startOf('isoweek');
    return HospoHero.dateUtils.getWeekDays(weekDate);
  },
  shiftBuffer: function () {
    return Template.instance().shiftBuffer.get();
  },
  onCopyShift: function () {
    const self = Template.instance();
    return shift => {
      const copy = _.clone(shift);
      delete copy._id;

      self.shiftBuffer.set(copy);
    };
  }
});