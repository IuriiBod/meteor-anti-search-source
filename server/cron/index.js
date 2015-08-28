Meteor.methods({
  'updateCronTime': function(time, id) {
    if(id == undefined) {
      id = CronConfig.insert({time: time});
    } else {
      CronConfig.update({_id: id}, {time: time});
    }
    return id;
  },

  'getCronTime': function() {
    var cronConfig = CronConfig.findOne();
    return cronConfig.time;
  },

  'sendShiftUpdates': function() {
    var users = ShiftsUpdates.find().fetch();
    var distinctUsers = _.uniq(users, false, function(d) {return d.to});
    var userIds = _.pluck(distinctUsers, "to");

    userIds.forEach(function(userId) {
      var senderId;
      var receiver = Meteor.users.findOne({_id: userId});
      var shiftUpdatesInfo = ShiftsUpdates.find({to: userId}).fetch();

      var emailText = "Hi " + receiver.username + ", <br>";
      emailText += "There have been some changes to your shifts:<br><br>";

      shiftUpdatesInfo.forEach(function(shift) {
        var color = shift.type == "update" ? "#009293" : "#FF2138";
        emailText += '<span style="color: ' + color + '">' + shift.text + '</span><br>';
        senderId = shift.userId;
      });

      var sender = Meteor.users.findOne({_id: senderId});

      emailText += "<br>Thanks.<br>";
      emailText += sender.username;

      Email.send({
        "to": receiver.emails[0].address,
        "from": sender.emails[0].address,
        "subject": "[Hero Chef] Daily shift updates",
        "html": emailText
      });
    });

    ShiftsUpdates.remove({});

    return true;
  }
});
