// context event: CalendarEvent Object

Template.eventItemFlyoutContent.onCreated(function () {
  this.event = new ReactiveVar(this.data.event);
});

Template.eventItemFlyoutContent.helpers({
  newEvent () {
    let event = this.event;

    if (event.shiftId && !event._id) {
      let lastEvent = CalendarEvents.findOne({
        shiftId: event.shiftId
      }, {
        sort: {startTime: -1}
      });

      // when we create a new event, we change it start/end time
      // according to the latest existing event time or shift time
      let timeDifference = moment(event.endTime).diff(event.startTime, 'minutes');
      let startTime;

      if (lastEvent) {
        startTime = lastEvent.endTime;
      } else {
        let shift = Shifts.findOne(event.shiftId);
        startTime = shift.startTime;
      }

      event.startTime = startTime;
      event.endTime = moment(startTime).add(timeDifference, 'minutes').toDate();
    }

    return event;
  },

  eventContentTemplate: function () {
    let type = this.event.type;
    let eventSettings = HospoHero.calendar.getEventByType(type);
    return eventSettings && eventSettings.flyoutTemplate;
  },

  onTimeSave () {
    let tmpl = Template.instance();

    return (startTime, endTime) => {
      let event = tmpl.event.get();
      let applyTime = HospoHero.dateUtils.applyTimeToDate;
      
      _.extend(event, {
        startTime: applyTime(event.startTime, startTime),
        endTime: applyTime(event.endTime, endTime)
      });

      tmpl.event.set(event);
    };
  },

  onEventSave () {
    let tmpl = Template.instance();

    return (domElement) => {
      let event = tmpl.event.get();
      let methodName = event._id ? 'editCalendarEvent' : 'addCalendarEvent';

      Meteor.call(methodName, event, HospoHero.handleMethodResult(() => {
        if (!event._id) {
          let flyout = FlyoutManager.getInstanceByElement(domElement);
          flyout.close();
        }
      }));
    };
  },

  event () {
    return Template.instance().event.get();
  }
});