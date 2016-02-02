Namespace('HospoHero.calendar', {
  events: {
    'recurring job': {
      title: 'Recurring Job',
      collection: 'jobItems',
      queryOptions: {
        frequency: {
          $exists: true
        }
      },
      eventSettings: {
        titleField: 'name',
        backgroundColor: '#1AB394',
        textColor: '#FFF',
        flyoutTemplate: 'eventRecurringJob'
      },
      manualAllocating: false
    },

    'prep job': {
      title: 'Prep Job',
      collection: 'jobItems',
      queryOptions: {
        frequency: {
          $exists: false
        }
      },
      eventSettings: {
        titleField: 'name',
        backgroundColor: '#2077C5',
        textColor: '#FFF',
        flyoutTemplate: 'eventRecurringJob'
      },
      manualAllocating: true
    }
  },

  getEventByType: function (eventType) {
    return this.events[eventType] || false;
  },

  getEventNames: function (onlyManualAllocated) {
    var events = _.map(this.events, function (eventObject, eventName) {
      if (!onlyManualAllocated || onlyManualAllocated && eventObject.manualAllocating) {
        return eventName;
      } else {
        return false;
      }
    });
    return _.compact(events);
  }
});