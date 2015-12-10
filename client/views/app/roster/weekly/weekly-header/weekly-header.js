Template.weeklyHeader.onCreated(function () {
  var currentDate = HospoHero.misc.getWeekDateFromRoute(Router.current());
  this.set('currentDate', currentDate);
  this.set('collapseIn', false);
  this.set('selectedWeekDate', HospoHero.dateUtils.getDateByWeekDate(currentDate));
});

Template.weeklyHeader.helpers({
  onDateChanged: function () {
    return function (weekDate) {
      Router.go(Router.current().route.getName(), weekDate);
    };
  },

  isPublished: function () {
    var tmpl = Template.instance();

    var shiftDateQuery = TimeRangeQueryBuilder.forWeek(tmpl.get('selectedWeekDate'));
    var shift = Shifts.findOne({
      shiftDate: shiftDateQuery,
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

