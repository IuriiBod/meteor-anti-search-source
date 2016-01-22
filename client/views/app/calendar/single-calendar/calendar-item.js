//var eventsMock = [
//  {
//    id: '1',
//    title: 'First event',
//    start: moment(),
//    end: moment().add(2, 'hours'),
//    backgroundColor: 'rgb(111, 148, 255)',
//    item: {
//      type: 'job',
//      id: '5a9zoEELBABAhNDcG'
//    }
//  }
//];

Template.calendarItem.onCreated(function () {
  this.calendarView = 'day';

  var self = this;
  this.changeDate = function (action, step) {
    var date = moment(new Date(self.data.date));
    date = moment(date)[action](step, self.calendarView).format('YYYY-MM-DD');
    Router.go('calendar', {date: date});
  };
});

Template.calendarItem.helpers({
  calendarOptions: function () {
    // If the type of a calendar is Manager - do not displaying agendaWeek button
    var headerButtons = this.type === 'manager' ? '' : 'agendaDay, agendaWeek';

    var area = HospoHero.getCurrentArea();
    var location = Locations.findOne({_id: area.locationId});

    return {
      header: {
        right: headerButtons + ' prev, next'
      },
      defaultView: 'agendaDay',
      defaultDate: this.date,

      displayTime: true,
      timezone: location && location.timezone,

      allDaySlot: false,

      columnFormat: 'ddd DD/MM',

      dayRender: function (date, cell) {
        console.log('ARGS', arguments);

      },

      events: function (start, end, timezone, callback) {
        //callback(eventsMock);
      },

      eventClick: function () {
        console.log('ARFS', arguments);

      }
    }
  }
});

Template.calendarItem.events({
  'click .fc-prev-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.changeDate('subtract', 1);
  },

  'click .fc-next-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.changeDate('add', 1);
  },

  'click .fc-agendaDay-button': function (event, tmpl) {
    tmpl.calendarView = 'day';
  },

  'click .fc-agendaWeek-button': function (event, tmpl) {
    tmpl.calendarView = 'week';
  }
});