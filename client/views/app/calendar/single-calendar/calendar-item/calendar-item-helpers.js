Template.calendarItem.helpers({
  calendarOptions: function () {
    // If the type of a calendar is Manager - do not displaying agendaWeek button
    //var headerButtons = this.type === 'manager' ? '' : 'agendaDay, agendaWeek';

    var area = HospoHero.getCurrentArea();
    if (area) {
      var tmpl = Template.instance();
      var location = Locations.findOne({_id: area.locationId});

      return {
        id: this.userId,
        header: {
          right: 'agendaDay, agendaWeek, prev, next'
        },
        defaultView: this.type === 'day' ? 'agendaDay' : 'agendaWeek',
        defaultDate: this.date,
        firstDay: 1,
        displayTime: true,
        timezone: location.timezone,

        allDaySlot: false,

        columnFormat: 'ddd DD/MM',

        events: function (start, end, timezone, callback) {
          var events = tmpl.getCalendarEvents();
          callback(events);
        },

        eventClick: function () {
          console.log('ARFS', arguments);

        }
      }
    }
  }
});