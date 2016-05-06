// context title: (String), name: (String), type: (String), date: (Date)

Template.calendarHeader.onCreated(function () {
  this.isManagerCalendar = this.data.type === 'manager';
});

Template.calendarHeader.helpers({
  onDateChanged: function () {
    var self = this;
    return function (date) {
      routerReload(self.type, date, self.userId);
    };
  },

  isTodayDate() {
    return this.date === HospoHero.dateUtils.shortDateFormat();
  },

  routeName() {
    return Template.instance().isManagerCalendar ? 'managerCalendar' : 'calendar';
  },

  todayCalendarRouteData() {
    let routeData = {
      date: HospoHero.dateUtils.shortDateFormat()
    };

    if (!Template.instance().isManagerCalendar) {
      routeData.type = 'day';
      routeData.userId = Meteor.userId();
    }

    return routeData;
  },

  isCalendarType (type) {
    return this.type === type;
  },

  weekPickerType () {
    return this.type === 'week' ? 'week' : 'day';
  }
});


Template.calendarHeader.events({
  'click .calendar-day': function (event, tmpl) {
    routerReload('day', tmpl.data.date, tmpl.data.userId);
  },

  'click .calendar-week': function (event, tmpl) {
    routerReload('week', tmpl.data.date, tmpl.data.userId);
  },

  'click .add-item-to-calendar': function (event, tmpl) {
    FlyoutManager.open('addEventItemFlyout', {
      onEventChange: tmpl.onEventChange()
    });
  }
});


var routerReload = function (type, date, userId) {
  Router.go(Router.current().route.getName(), {type: type, date: date, userId: userId});
};