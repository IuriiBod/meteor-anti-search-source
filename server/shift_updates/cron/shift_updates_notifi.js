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
  var receiver = Meteor.users.findOne(this.receiver);
  this.receiverName = HospoHero.username(receiver);
  this.to = receiver.emails[0].address;
  delete this.receiver;

  var senderId = this.shiftUpdates[0].userId;
  var sender = Meteor.users.findOne(senderId);
  this.senderName = HospoHero.username(sender);
  this.from = sender.emails[0].address;
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

ShiftUpdatesToEmail.prototype.sendEmail = function() {
  this._setRecipients();
  this._generateEmail();

  return Email.send({
    to: this.to,
    from: this.from,
    subject: this.subject,
    html: this.emailText
  });
};