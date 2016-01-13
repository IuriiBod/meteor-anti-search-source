Template.teamHoursMainView.onCreated(function () {
  this.set('weekDate', moment(this.data.date));
  this.set('tableViewMode', 'shifts');
  this.set('searchText', '');
});


Template.teamHoursMainView.helpers({
  dayOfWeek: function (date) {
    return moment(date).format('dddd');
  },
  formatDate: function (date) {
    return HospoHero.dateUtils.shortDateFormat(moment(date));
  },
  onKeyUp: function () {
    var tmpl = Template.instance();
    return function (searchText) {
      tmpl.set('searchText', searchText);
    }
  },
  users: function (searchText) {
    var query = {
      'relations.areaIds': HospoHero.getCurrentAreaId()
    };
    if (searchText) {
      query['profile.firstname'] =  new RegExp(searchText, 'i');
    }
    return Meteor.users.find(query);
  },
  weekDays: function (weekDate) {
    return HospoHero.dateUtils.getWeekDays(weekDate);
  }
});


Template.teamHoursMainView.events({
  'click .shiftView': function (event, tmpl) {
    tmpl.set('tableViewMode', 'shifts');
  },

  'click .hoursView': function (event, tmpl) {
    tmpl.set('tableViewMode', 'hours');
  }
});
