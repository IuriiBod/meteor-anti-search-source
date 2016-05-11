Namespace('HospoHero.calendar', {
  /**
   * Object with available calendar events
   *
   * eventType: {
   *   collection - Mongo.Collection name to select items
   *   titleField - field with the item name
   *   flyoutTemplate - the name of template to render after click on event
   *   borderColor - color of the event
   *   duration - function that returns a Duration object
   * }
   */
  events: {
    'recurring job': {
      collection: 'jobItems',
      titleField: 'name',
      borderColor: '#1AB394',
      flyoutTemplate: 'eventRecurringJob',

      duration: function (job) {
        return moment.duration(job.activeTime, 'seconds');
      }
    },

    'prep job': {
      collection: 'jobItems',
      titleField: 'name',
      borderColor: '#23C6C8',
      flyoutTemplate: 'eventPrepJob',

      duration: function (job) {
        return moment.duration(job.activeTime, 'seconds');
      }
    },

    task: {
      collection: 'taskList',
      titleField: 'title',
      borderColor: '#27a0c9',
      flyoutTemplate: 'eventTask',

      duration: function (task) {
        return task.duration !== 0 ? moment.duration(task.duration, 'minutes') : false;
      }
    },

    meeting: {
      collection: 'meetings',
      titleField: 'title',
      borderColor: '#b35cd6',
      flyoutTemplate: 'eventMeeting',

      duration: function (meeting) {
        let duration = moment(meeting.endTime).diff(meeting.startTime, 'minutes');
        return moment.duration(duration, 'minutes');
      }
    },

    project: {
      collection: 'projects',
      titleField: 'title',
      borderColor: '#F1B755',
      flyoutTemplate: 'eventProject',

      duration: function (project) {
        let duration = moment(project.endTime).diff(project.startTime, 'minutes');
        return moment.duration(duration);
      }
    }
  }
});