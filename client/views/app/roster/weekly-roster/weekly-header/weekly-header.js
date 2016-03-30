Template.weeklyHeader.onCreated(function () {
  var currentDate = moment(HospoHero.getParamsFromRoute('date'));
  this.set('currentDate', currentDate);
  this.set('collapseIn', false);
  this.set('selectedWeekDate', moment(currentDate).toDate());
});

Template.weeklyHeader.helpers({
  onDateChanged: function () {
    return function (date) {
      Router.go(Router.current().route.getName(), {date: date});
    };
  },

  isPublished: function () {
    var tmpl = Template.instance();

    var shiftDateQuery = TimeRangeQueryBuilder.forWeek(tmpl.get('selectedWeekDate'));
    var shift = Shifts.findOne({
      startTime: shiftDateQuery,
      published: true,
      'relations.areaId': HospoHero.getCurrentAreaId()
    });

    if (shift) {
      tmpl.set('publishedOnDate', moment(shift.publishedOn));
    }

    return !!shift;
  }
});

Template.weeklyHeader.events({
  'click #publishRoster': function (event, tmpl) {
    event.preventDefault();
    var query = TimeRangeQueryBuilder.forWeek(tmpl.get('selectedWeekDate'));
    Meteor.call('publishRoster', query, HospoHero.handleMethodResult());
  },

  'click .showHideButton': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('collapseIn', !tmpl.get('collapseIn'));
  }
});

