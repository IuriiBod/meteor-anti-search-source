Template.weekSelector.rendered = function () {
  $('.i-checks').iCheck({
    radioClass: 'iradio_square-green'
  });
};

Template.weekSelector.helpers({
  futureWeeks: function () {
    var currentMoment = moment().startOf('week');
    var weeks = [];

    for (var i=0; i<6; i++) {
      weeks.push(
        moment(currentMoment).toDate()
      );
      currentMoment.add(1, 'week');
    }
    return weeks;
  },

  weekFormat: function (date) {
    return moment(date).week();
  },
  dateFormat: function (date) {
    return moment(date).format("dddd, Do of MMMM YYYY");
  }
});

Template.weekSelector.events({
  'click .saveShifts': function (event, tmpl) {
    event.preventDefault();

    var selectedWeek = tmpl.get('selectedWeek');

    if (selectedWeek) {
      // new Date(selectedWeek) for overcoming moment js deprecated error
      var templateSelectedWeek = moment(0).week(2).startOf('isoweek').day(moment(new Date(selectedWeek)).day());

      var timeRangeForWeek = TimeRangeQueryBuilder.forWeek(templateSelectedWeek, HospoHero.getCurrentArea().locationId);
      var shifts = Shifts.find({
        startTime: timeRangeForWeek,
        type: 'template'
      });

      var toCurrentDayMoment = function (date) {
        var selectedWeekMoment = moment(new Date(selectedWeek));
        return moment(date).set({
          year: selectedWeekMoment.year(),
          week: selectedWeekMoment.week()
        }).toDate();
      };

      shifts.forEach(function (shift) {
        delete shift._id;
        shift.type = null;
        shift.startTime = toCurrentDayMoment(shift.startTime);
        shift.endTime = toCurrentDayMoment(shift.endTime);

        Meteor.call("createShift", shift, HospoHero.handleMethodResult());
      });

      HospoHero.success('Template was copied to the week number ', moment(new Date(selectedWeek)).week());
    } else {
      HospoHero.error('You should select week at first');
    }

    return false;
  },

  'ifChecked [name=week-radio]': function (event, tmpl) {
    tmpl.set('selectedWeek', event.target.value);
  }
});