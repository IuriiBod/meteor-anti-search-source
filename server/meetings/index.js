// TODO: Need a universal property change logger
class MeetingPropertyChangeLogger {
  constructor(meeting, userId) {
    this.meeting = meeting;
    this.userId = userId;

    this.trackedProperties = {
      title: 'title',
      location: 'location',
      startTime: 'start date and time',
      endTime: 'end time'
    };
  }

  _formatProperty(meeting, property) {
    var propertiesFormatters = {
      startTime: HospoHero.dateUtils.fullDateFormat,
      endTime: HospoHero.dateUtils.timeFormat
    };
    return !!propertiesFormatters[property] ? propertiesFormatters[property](meeting[property]) : meeting[property];
  }

  _notificationTitle(meeting) {
    return 'Update on meeting dated ' + HospoHero.dateUtils.dateInterval(meeting.startTime, meeting.endTime);
  }

  _notificationChangeMessage(newMeeting, propertyName) {
    return this.trackedProperties[propertyName] + ' has been updated to ' + this._formatProperty(newMeeting, propertyName);
  }

  _sendNotification(message, meeting, toUserId) {
    var notificationText = this._notificationTitle(meeting) + ': ' + message;

    new NotificationSender(
      'Update on meeting',
      'update-on-meeting',
      {
        text: notificationText
      },
      {
        helpers: {
          linkToItem: function () {
            return NotificationSender.urlFor('meetingDetails', {id: meeting._id}, this);
          }
        }
      }
    ).sendNotification(toUserId);
  }

  _trackUserRemovedFromMeeting(oldMeeting, newMeeting) {
    let diffUser = _.difference(oldMeeting.attendees, newMeeting.attendees);
    if (diffUser.length) {
      let message;

      if (oldMeeting.attendees.length > newMeeting.attendees.length) {
        message = 'You have been removed from this meeting';
      } else {
        message = 'You have been added to this meeting';
      }

      this._sendNotification(message, oldMeeting, diffUser[0]);
    }
  }

  trackChanges () {
    let oldMeeting = Meetings.findOne({_id: this.meeting._id});

    var isPropertyChanged = (propertyName) => {
      let oldPropertyValue = oldMeeting[propertyName];
      let newPropertyValue = this.meeting[propertyName];

      if (_.isDate(oldPropertyValue)) {
        oldPropertyValue = oldPropertyValue.valueOf();
        newPropertyValue = newPropertyValue.valueOf();
      }
      return oldPropertyValue !== newPropertyValue;
    };

    let shiftChangesMessages = Object.keys(this.trackedProperties).filter((propertyName) => {
      return isPropertyChanged(propertyName);
    }).map((propertyName) => {
      return this._notificationChangeMessage(this.meeting, propertyName);
    });

    if (shiftChangesMessages.length) {
      let fullMessage = shiftChangesMessages.join(', ');
      this._sendNotification(fullMessage, oldMeeting, this.userId, this.meeting.assignedTo);
      this._trackUserRemovedFromMeeting(oldMeeting, this.meeting, this.userId);
    }
  }
}

let canUserCreateMeetings = (areaId = null) => {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'create meetings');
};

let isAttendeeInMeeting = (attendees = []) => {
  return attendees.indexOf(Meteor.userId()) > -1;
};

Meteor.methods({
  createMeeting (meetingDoc) {
    check(meetingDoc, HospoHero.checkers.MeetingChecker);

    if (!canUserCreateMeetings()) {
      throw new Meteor.Error('You can\'t create meetings');
    } else {
      let defaultMeeting = {
        accepted: [],
        maybeAccepted: [],
        rejected: [],
        createdBy: Meteor.userId(),
        createdAt: new Date()
      };

      _.extend(meetingDoc, defaultMeeting);

      return Meetings.insert(meetingDoc);

      // if we will need sending messages about meeting creating
      //let meetingId = Meetings.insert(meetingDoc);
      //if (meetingDoc.attendees.length) {
      //  sendNotificationsAboutNewMeeting(meetingId, meetingDoc);
      //}
    }
  },

  editMeeting (newMeetingObject) {
    check(newMeetingObject, HospoHero.checkers.MeetingChecker);

    if (!(isAttendeeInMeeting(newMeetingObject.attendees) || canUserCreateMeetings())) {
      throw new Meteor.Error('Yot can\'t edit the meeting');
    } else {
      let meetingLogger = new MeetingPropertyChangeLogger(newMeetingObject, Meteor.userId());
      meetingLogger.trackChanges();
      Meetings.update({_id: newMeetingObject._id}, {$set: newMeetingObject});
    }
  },

  'accept-meeting-invite' (notificationId, action) {
    let userId = Meteor.userId();
    let notification = Notifications.findOne({_id: notificationId});

    if (notification) {
      let meetingId = notification.meta.meetingId;
      let meeting = Meetings.findOne({_id: meetingId, attendees: userId});

      if (meeting) {
        let changeArrayValue = (array, isAddingNewValue) => {
          if (isAddingNewValue) {
            array.push(userId);
          } else {
            array = _.without(array, userId);
          }
          return _.uniq(array);
        };

        ['accepted', 'maybeAccepted', 'rejected'].forEach((field) => {
          meeting[field] = changeArrayValue(meeting[field], field === action);
        });

        Meteor.call('editMeeting', meeting);
      } else {
        throw new Meteor.Error(403, 'You are not invited on this meeting');
      }
      Notifications.remove({_id: notificationId});
    }
  }
});

function sendNotificationsAboutNewMeeting (meetingId, meetingDoc) {
  let templateData = {
    meeting: {
      title: meetingDoc.title,
      location: meetingDoc.location,
      time: HospoHero.dateUtils.dateInterval(meetingDoc.startTime, meetingDoc.endTime)
    }
  };

  let options = {
    interactive: true,
    helpers: {
      url () {
        return NotificationSender.urlFor('meetingDetails', {id: meetingId}, this);
      },

      yesUrl () {
        return NotificationSender.actionUrlFor('accept-meeting-invite', 'accepted', this);
      },

      maybeUrl () {
        return NotificationSender.actionUrlFor('accept-meeting-invite', 'maybeAccepted', this);
      },

      noUrl () {
        return NotificationSender.actionUrlFor('accept-meeting-invite', 'rejected', this);
      }
    },

    meta: {
      meetingId: meetingId
    }
  };

  let notificationSender = new NotificationSender('New meeting', 'new-meeting', templateData, options);
  meetingDoc.attendees.forEach((userId) => {
    notificationSender.sendBoth(userId);
  });
}