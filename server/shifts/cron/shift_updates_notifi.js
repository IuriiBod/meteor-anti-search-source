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

ShiftUpdatesToEmail.prototype._setRecipients = function() {
  var receiver;
  var sender;

  try {
    receiver = this._getUserData(this.receiver);
  } catch(e) {
    console.log(e.message);
    return false;
  }

  this.receiverName = receiver.username;
  this.to = receiver.email;
  delete this.receiver;

  var senderId = this.shiftUpdates[0].userId;
  try {
    sender = this._getUserData(senderId);
  } catch(e) {
    console.log(e.message);
    return false;
  }

  this.senderName = sender.username;
  this.from = sender.email;

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
      throw new Meteor.Error(ShiftUpdatesToEmail.userNotFoundError(this.receiver));
    }
  } else {
    throw new Meteor.Error('Receiver ID undefined');
  }
};

ShiftUpdatesToEmail.prototype._generateEmail = function() {
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
  if(this._setRecipients()) {
    this._generateEmail();

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