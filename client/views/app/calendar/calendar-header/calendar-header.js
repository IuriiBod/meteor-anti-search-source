Template.calendarHeader.helpers({
  onDateChanged: function () {
    var self = this;
    return function (date) {
      routerReload(self.type, date, self.userId);
    };
  }
});

Template.calendarHeader.events({
  'click .calendar-day': function (event, tmpl) {
    routerReload('day', tmpl.data.date, tmpl.data.userId);
  },

  'click .calendar-week': function (event, tmpl) {
    routerReload('week', tmpl.data.date, tmpl.data.userId);
  }
});


var routerReload = function (type, date, userId) {
  Router.go(Router.current().route.getName(), {type: type, date: date, userId: userId});
};