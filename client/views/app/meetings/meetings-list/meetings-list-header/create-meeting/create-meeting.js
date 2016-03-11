Template.createMeeting.onCreated(function () {
  let today = moment();

  this.meetingDate = new ReactiveVar(today.toDate());
  this.startTime = new ReactiveVar(today.toDate());
  this.endTime = new ReactiveVar(moment(today).add(1, 'hour').toDate());
  this.attendees = new ReactiveVar([]);

  this.addNewAttendee = new ReactiveVar(false);
});


Template.createMeeting.onRendered(function () {
  this.$('input[name=title]').focus();

  this.$('.datepicker').datepicker({
    format: 'YYYY-MM-DD',
    startDate: this.meetingDate.get()
  });
});


Template.createMeeting.helpers({
  meetingDate () {
    return HospoHero.dateUtils.shortDateFormat(Template.instance().meetingDate.get());
  },

  timeComboEditableParams () {
    let tmpl = Template.instance();
    return {
      minuteStepping: 10,
      firstTime: tmpl.startTime.get(),
      secondTime: tmpl.endTime.get(),
      onSubmit: function (startTime, endTime) {
        tmpl.startTime.set(startTime);
        tmpl.endTime.set(endTime);
      }
    };
  },

  addNewAttendee () {
    return Template.instance().addNewAttendee.get();
  },

  attendees () {
    return Template.instance().attendees.get();
  },

  onUserSelect () {
    let tmpl = Template.instance();
    return function (userId) {
      let attendees = tmpl.attendees.get();
      attendees.push(userId);
      tmpl.attendees.set(attendees);
    };
  },

  onUserRemove () {
    let tmpl = Template.instance();
    return function (userId) {
      let attendees = tmpl.attendees.get();
      attendees.splice(attendees.indexOf(userId), 1);
      tmpl.attendees.set(attendees);
    };
  }
});


Template.createMeeting.events({
  'changeDate .datepicker' (event, tmpl) {
    tmpl.meetingDate.set(event.date);
  },

  'click .add-attendee' (event, tmpl) {
    event.preventDefault();
    tmpl.addNewAttendee.set(!tmpl.addNewAttendee.get());
  },

  'submit form' (event, tmpl) {
    event.preventDefault();

    let fields = ['title', 'location'];
    let meetingInfo = HospoHero.misc.getValuesFromEvent(event, fields, true);

    let fixMeetingTime = function (time) {
      let timeMoment = moment(time);

      let meetingDate = tmpl.meetingDate.get();
      let meetingDateMoment = moment(meetingDate);

      return meetingDateMoment.set({
        hour: timeMoment.hours(),
        minutes: timeMoment.minutes()
      }).toDate();
    };

    _.extend(meetingInfo, {
      startTime: fixMeetingTime(tmpl.startTime.get()),
      endTime: fixMeetingTime(tmpl.endTime.get()),
      attendees: tmpl.attendees.get()
    });

    Meteor.call('createMeeting', meetingInfo, HospoHero.handleMethodResult(() => {
      let flyout = FlyoutManager.getInstanceByElement(event.target);
      flyout.close();
    }));
  }
});