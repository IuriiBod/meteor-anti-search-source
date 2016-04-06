// context CalendarEvent Object

Template.calendarItemEvent.onCreated(function () {
  let event = this.data;
  let eventDuration = getEventDuration(event);

  this.timer = MultiTimer.getInstance();
  this.timer.add(event._id, eventDuration);

  //when event have been already started, start the timer
  let timerAction = event.status === 'started' ? 'start' : 'pause';
  this.timer[timerAction](event._id);

  this.eventSettings = HospoHero.calendar.getEventByType(event.type);
});

Template.calendarItemEvent.helpers({
  eventTitle () {
    return HospoHero.calendar.getEventTitle(this);
  },

  eventTimeIntervalFormat () {
    let format = (time) => moment(time).format('h:mm a');
    return `${format(this.startTime)} - ${format(this.endTime)}`;
  },

  eventDuration () {
    let addZeroToBegining = (value) => value < 10 ? `0${value}` : value;

    let duration = Template.instance().timer.get(this._id);

    if (duration && duration !== 0) {
      let momentDuration = moment.duration(duration, 'seconds');

      let durationInMinutes = addZeroToBegining(momentDuration.minutes());
      let durationInSeconds = addZeroToBegining(momentDuration.seconds());

      return `${momentDuration.hours()}:${durationInMinutes}:${durationInSeconds}`;
    } else {
      return '0:00:00';
    }
  },

  timeTogglerIconClass () {
    return this.status && this.status === 'started' ? 'fa-stop-circle-o' : 'fa-play-circle-o';
  },

  canToggleTimer () {
    let shortDateFormat = HospoHero.dateUtils.shortDateFormat;

    let calendarItemData = Template.parentData(2);
    return calendarItemData.type !== 'manager' &&
      calendarItemData.userId === Meteor.userId() &&
      calendarItemData.date === shortDateFormat(new Date());
  },

  borderColor () {
    return Template.instance().eventSettings.borderColor;
  }
});

Template.calendarItemEvent.events({
  'click .timer-toggle': function (event, tmpl) {
    event.preventDefault();
    let eventItem = tmpl.data;

    // find already started event in current day
    let alreadyStartedEvent = CalendarEvents.findOne({
      _id: {$ne: eventItem._id},
      shiftId: eventItem.shiftId,
      status: 'started'
    });

    // stop already started event
    if (alreadyStartedEvent) {
      startStopEvent(alreadyStartedEvent, tmpl.timer);
      Meteor.call('editCalendarEvent', alreadyStartedEvent, HospoHero.handleMethodResult());
    }

    startStopEvent(eventItem, tmpl.timer);
    Meteor.call('editCalendarEvent', eventItem, HospoHero.handleMethodResult());
  },

  'click .calendar-item-event-title': function (event, tmpl) {
    event.preventDefault();
    FlyoutManager.open('eventItemFlyout', {event: tmpl.data});
  }
});

/**
 * Extends current event; start or stop current event
 * @param {Object} event - event object
 * @param {Object} timer - timer object
 */
function startStopEvent(event, timer) {
  if (event.status === 'started') {
    timer.pause(event._id);

    _.extend(event, {
      status: 'stopped',
      duration: getEventDuration(event)
    });
  } else {
    timer.start(event._id);

    _.extend(event, {
      status: 'started',
      startedAt: new Date()
    });
  }
}

/**
 * Returns current duration of event in seconds
 * @param {Object} event - event object
 * @returns {Number}
 */
function getEventDuration(event) {
  let presentEventDuration = event.duration || 0;

  let newEventDuration = 0;
  // update newEventDuration only when the event have been started
  if (event.status === 'started') {
    newEventDuration = moment().diff(event.startedAt, 'seconds');
  }

  return presentEventDuration + newEventDuration;
}