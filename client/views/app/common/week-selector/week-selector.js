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
      var shifts = Shifts.find({
        type: 'template',
        'relations.areaId': HospoHero.getCurrentAreaId()
      });

      var toCurrentDayMoment = function (date) {
        date = moment(date);
        // new Date(selectedWeek) for overcoming moment js deprecated error
        var selectedWeekMoment = moment(new Date(selectedWeek));
        selectedWeekMoment.set({
          hours: date.hour(),
          minutes: date.minutes(),
          seconds: 0,
          day: date.day()
        });

        // The Crutch. Because of moment defaults week starts from Sunday
        if (date.day() === 0) {
          selectedWeekMoment.add(1, 'week');
        }
        return selectedWeekMoment.toDate();
      };

      shifts.forEach(function (shift) {
        delete shift._id;
        shift.type = null;
        shift.startTime = toCurrentDayMoment(shift.startTime);
        shift.endTime = toCurrentDayMoment(shift.endTime);

        Meteor.call("createShift", shift, HospoHero.handleMethodResult());
      });

      var weekSelectorModal = ModalManager.getInstanceByElement(event.target);
      weekSelectorModal.close();
      HospoHero.success('Template was copied to the selected week');
    } else {
      HospoHero.error('You should select week at first');
    }

    return false;
  },

  'ifChecked [name=week-radio]': function (event, tmpl) {
    tmpl.set('selectedWeek', event.target.value);
  }
});