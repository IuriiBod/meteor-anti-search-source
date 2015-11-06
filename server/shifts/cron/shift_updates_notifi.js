SyncedCron.add({
  name: 'Send emails to users with shift updates',
  schedule: function(parser) {
    return parser.text('every 1 hour');
  },
  job: function() {
    var locationsToUpdate = Locations.find({
      shiftUpdateHour: new Date().getHours()
    });
    locationsToUpdate.forEach(function (location) {
      sendShiftUpdates(location._id);
    })
  }
});

var sendShiftUpdates = function(locationId) {
  var users = ShiftsUpdates.find({
    locationId: locationId
  }).fetch();

  var shiftsGroupedByUser = _.groupBy(users, function(user) {
    return user.to;
  });

  _.map(shiftsGroupedByUser, function(shiftUpdates, userId) {
    var email = new ShiftUpdatesToEmail({
      receiver: userId,
      shiftUpdates: shiftUpdates
    });
    email.sendEmail();
  });

  ShiftsUpdates.remove({
    locationId: locationId
  });

  return true;
};

ShiftUpdatesToEmail = function ShiftUpdatesToEmail (options) {
  this.receiver = options.receiver;
  this.shiftUpdates = options.shiftUpdates;
  this.subject = '[Hero Chef] Daily shift updates';
};

ShiftUpdatesToEmail.prototype._getSenderAndReceiver = function() {
  var receiver = this._getUserData(this.receiver);

  if(!receiver) {
    return false;
  } else {
    this.receiverName = receiver.username;
    this.to = receiver.email;
    delete this.receiver;
  }

  var senderId = this.shiftUpdates[0].userId;
  var sender = this._getUserData(senderId);
  if(!sender) {
    return false;
  } else {
    this.senderName = sender.username;
    this.from = sender.email;
  }
  return true;
};

ShiftUpdatesToEmail.prototype._getUserData = function(userId) {
  if(userId) {
    var user = Meteor.users.findOne(userId);

    if (user && user.emails && user.emails.length) {
      return {
        username: HospoHero.username(user),
        email: user.emails[0].address
      };
    } else {
      logger.error(ShiftUpdatesToEmail.userNotFoundError(this.receiver));
      return false;
    }
  } else {
    logger.error('Receiver ID undefined');
    return false;
  }
};

ShiftUpdatesToEmail.prototype._generateEmailText = function() {
  var emailText = [];
  var color;

  emailText.push('Hi ' + this.receiverName + ', <br>');
  emailText.push('There have been some changes to your shifts:<br><br>');

  _.map(this.shiftUpdates, function(shift) {
    color = shift.type == "update" ? "#009293" : "#FF2138";
    emailText.push('<span style="color: ' + color + '">' + shift.text + '</span><br>');
  });

  emailText.push('<br>Thanks.<br>' + this.senderName);

  this.emailText = emailText.join('');
};

ShiftUpdatesToEmail.userNotFoundError = function(userId) {
  return 'User ' + userId + ' not found';
};

ShiftUpdatesToEmail.prototype.sendEmail = function() {
  if(this._getSenderAndReceiver()) {
    this._generateEmailText();

    return Email.send({
      to: this.to,
      from: this.from,
      subject: this.subject,
      html: this.emailText
    });
  } else {
    return false;
  }
};