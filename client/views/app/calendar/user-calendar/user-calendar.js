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

Template.userCalendar.helpers({
  calendarOptions: function () {
    var area = HospoHero.getCurrentArea();
    var location = Locations.findOne({_id: area.locationId});

    return {
      header: {
        right: 'agendaDay, agendaWeek, prev, next'
      },
      defaultView: 'agendaDay',
      defaultDate: this.date,

      displayTime: true,
      timezone: location.timezone,

      allDaySlot: false,

      columnFormat: 'ddd DD/MM',

      events: function (start, end, timezone, callback) {
        //callback(eventsMock);
      },

      eventClick: function () {
        console.log('ARFS', arguments);

      }
    }
  }
});