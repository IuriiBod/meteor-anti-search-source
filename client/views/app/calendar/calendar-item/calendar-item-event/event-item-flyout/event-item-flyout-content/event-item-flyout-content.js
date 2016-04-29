// context event: CalendarEvent Object

Template.eventItemFlyoutContent.onCreated(function () {
  let event = this.data.event;
  this.eventDuration = moment(event.endTime).diff(event.startTime, 'minutes');
  this.event = new ReactiveVar(event);
});

Template.eventItemFlyoutContent.helpers({
  eventContentTemplate: function () {
    let type = this.event.type;
    let eventSettings = HospoHero.calendar.getEventByType(type);
    return eventSettings && eventSettings.flyoutTemplate;
  },

  onTimeSave () {
    const tmpl = Template.instance();

    return (startTime, endTime) => {
      const event = tmpl.event.get();
      const duration = tmpl.eventDuration;

      let applyTime = HospoHero.dateUtils.applyTimeToDate;
      let start = applyTime(event.startTime, startTime);
      let end = endTime ? applyTime(event.endTime, endTime) : moment(start).add(duration, 'minutes').toDate();

      Object.assign(event, {
        startTime: start,
        endTime: end
      });

      if (checkEventTime(event)) {
        tmpl.event.set(event);
        return true;
      }

      sweetAlert({
        title: 'Wrong event start time',
        text: 'Change time of start event, please',
        type: 'warning',
        confirmButtonColor: '#ec4758',
        animation: 'slide-from-top'
      });

      return false;
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

Template.eventItemFlyoutContent.events({
  'click .save-event': (event, tmpl) => {
    const calendarEvent = tmpl.event.get();
    const methodName = calendarEvent._id ? 'editCalendarEvent' : 'addCalendarEvent';

    Meteor.call(methodName, calendarEvent);

    const flyout = FlyoutManager.getInstanceByElement(event.target);
    flyout.close();
  }
});

function checkEventTime(event) {
  const shift = Shifts.findOne({_id: event.shiftId});

  if (moment(event.startTime).isBefore(shift.startTime) || moment(event.endTime).isAfter(shift.endTime)) {
    return false;
  }

  const events = CalendarEvents.find({
    _id: {$ne: event._id},
    shiftId: event.shiftId
  });

  let check = true;

  if (events.count() > 0) {
    events.forEach((_event) => {
      if (isEventsIntersect(event, _event)) {
        check = false;
      }
    });
  }

  return check;
}

function isEventsIntersect(firstEvent, secondEvent) {
  return (moment(firstEvent.startTime).isSameOrAfter(secondEvent.startTime) &&
      moment(firstEvent.startTime).isBefore(secondEvent.endTime)) ||
      (moment(secondEvent.startTime).isSameOrAfter(firstEvent.startTime) &&
      moment(secondEvent.startTime).isBefore(firstEvent.endTime));
}
