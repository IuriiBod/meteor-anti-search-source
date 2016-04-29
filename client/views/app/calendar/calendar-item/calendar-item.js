// context date: (Date), titleType: (String) userId: (MongoId)

Template.calendarItem.helpers({
  todayEvents () {
    return CalendarEvents.find({
      startTime: TimeRangeQueryBuilder.forDay(this.date),
      userId: this.userId
    }, {
      sort: {
        startTime: 1
      }
    });
  },

  calendarItemTitle () {
    if (this.type === 'manager') {
      return HospoHero.username(this.userId);
    } else if (this.type === 'week') {
      return HospoHero.dateUtils.dateFormat(this.date);
    } else {
      return false;
    }
  },

  userSection () {
    if (this.type !== 'manager') {
      return false;
    }

    const shift = Shifts.findOne({
      startTime: TimeRangeQueryBuilder.forDay(this.date),
      assignedTo: this.userId
    });

    const section = Sections.findOne({_id: shift.section});

    return section && section.name;
  },

  isDailyUserCalendar () {
    return this.type === 'day';
  },

  sortableOptions () {
    return {
      group: {
        name: 'calendarEvents',
        // allow move events out from list
        pull: true,
        // allow put events only from newEvents group
        put: ['newEvents']
      },

      // disable dragging of .grey-zone elements
      filter: '.grey-zone, .started',

      onAdd (event) {
        let addedEvent = new EventSortableHelper(event).getSortedEvent();
        addedEvent = setEventToLastPositionInShift(addedEvent);

        const addEvent = () => Meteor.call('addCalendarEvent', addedEvent);

        if (addedEvent.type === 'prep job' && !isUserHasSkillsForJob(addedEvent.userId, addedEvent.itemId)) {
          const jobItem = JobItems.findOne({_id: addedEvent.itemId});
          addNewSectionForUserDialog(addedEvent.userId, jobItem.section, addEvent);          
        } else {
          addEvent();
        }
      },

      // don't remove this!
      onUpdate () {},
      onRemove () {}
    };
  }
});


Template.calendarItem.events({
  'click .calendar-item-title' (event, tmpl) {
    let tmplData = tmpl.data;

    Router.go('calendar', {
      type: 'day',
      date: HospoHero.dateUtils.shortDateFormat(tmplData.date),
      userId: tmplData.userId
    });
  }
});

function isUserHasSkillsForJob(userId, jobId) {
  const jobItem = JobItems.findOne({_id: jobId});

  return !!jobItem && !!Meteor.users.findOne({
    _id: userId,
    'profile.sections': jobItem.section
  });
}

function addNewSectionForUserDialog(userId, sectionId, successfulCallback) {
  sweetAlert({
    title: 'Error!',
    text: 'User not trained for this section. Do you want to mark user as trained for this section?',
    type: 'error',
    showCancelButton: true,
    cancelButtonText: 'No',
    confirmButtonText: 'Yes',
    closeOnConfirm: true
  }, () => {
    Meteor.call(
        'toggleUserTrainingSection',
        userId,
        sectionId,
        true,
        HospoHero.handleMethodResult(successfulCallback)
    );
  });
}

function setEventToLastPositionInShift(event) {
  if (event.shiftId && !event._id) {
    const duration = moment(event.endTime).diff(event.startTime, 'minutes');


    let lastEvent = CalendarEvents.findOne({
      shiftId: event.shiftId
    }, {
      sort: {startTime: -1}
    });

    // when we create a new event, we change it start/end time
    // according to the latest existing event time or shift time
    let startTime;

    if (lastEvent) {
      startTime = lastEvent.endTime;
    } else {
      let shift = Shifts.findOne(event.shiftId);
      startTime = shift.startTime;
    }

    return Object.assign(event, {
      startTime: startTime,
      endTime: moment(startTime).add(duration, 'minutes').toDate()
    });
  }
}