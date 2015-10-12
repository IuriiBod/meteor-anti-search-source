SyncedCron.add({
  name: 'Send emails to users with shift updates',
  schedule: function(parser) {
    var t;
    Meteor.call("getCronTime", function(err, time) {
      if(err) {
        HospoHero.error(err);
      }
      if(time) {
        t = "at " + time.toLowerCase();
      } else {
        var d = new Date();
        d.setFullYear(d.getFullYear() + 50);
        t = "at 10:15 am in " + d.getFullYear();
      }

    });
    return parser.text(t);
  },
  job: function() {
     Meteor.call("sendShiftUpdates", function(err) {
      if(err) {
        HospoHero.error(err);
      } else {
        console.log("Shift updates have been successfully sended");
        return "Shift updates have been successfully sended";
      }
    });
  }
});