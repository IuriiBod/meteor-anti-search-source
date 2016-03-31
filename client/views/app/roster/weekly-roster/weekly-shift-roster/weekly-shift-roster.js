//context: weekDate (WeekDate), type ('template'/null)

Template.weeklyShiftRoster.onCreated(function () {
  this.shiftBuffer = new ReactiveVar(null);
});

Template.weeklyShiftRoster.helpers({
  datesOfWeek: function () {
    return HospoHero.dateUtils.getWeekDays(this.localMoment);
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