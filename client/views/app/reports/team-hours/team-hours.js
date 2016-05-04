Template.teamHoursMainView.onCreated(function () {
  this.weekDate = new ReactiveVar(moment(this.data.date));
  this.tableViewMode = new ReactiveVar('shifts');
  this.searchText = new ReactiveVar('');
});


Template.teamHoursMainView.helpers({
  weekDate() {
    return Template.instance().weekDate.get();
  },
  tableViewMode() {
    return Template.instance().tableViewMode.get();
  },
  searchText() {
    return Template.instance().searchText.get();
  },
  subtitle() {
    let shift = Shifts.findOne();
    let location = shift && Locations.findOne({_id: shift.relations.locationId});
    return location && `timezone: ${location.timezone}`;
  },
  dayOfWeek: function (date) {
    return moment(date).format('dddd');
  },
  formatDate: function (date) {
    return HospoHero.dateUtils.shortDateFormat(moment(date));
  },
  onKeyUp: function () {
    var tmpl = Template.instance();
    return function (searchText) {
      tmpl.searchText.set(searchText);
    };
  },
  users: function (searchText) {
    var query = {
      'relations.areaIds': HospoHero.getCurrentAreaId()
    };
    if (searchText) {
      query['profile.fullName'] = new RegExp(searchText, 'i');
    }
    return Meteor.users.find(query);
  },
  weekDays: function (weekDate) {
    return HospoHero.dateUtils.getWeekDays(weekDate);
  }
});


Template.teamHoursMainView.events({
  'click .shiftView': function (event, tmpl) {
    tmpl.tableViewMode.set('shifts');
  },

  'click .hoursView': function (event, tmpl) {
    tmpl.tableViewMode.set('hours');
  }
});
