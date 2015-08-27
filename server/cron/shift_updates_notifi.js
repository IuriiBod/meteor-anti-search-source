SyncedCron.add({
  name: 'Send emails to users with shift updates',
  schedule: function(parser) {
    var t;
    Meteor.call("getCronTime", function(err, time) {
      if(err) {
        console.log(err);
        return;
      }
      t = time;
    });
    return parser.text(t);
  },
  job: function() {
    var number = Math.random();
    console.log("Generated number: " + number);
    return "Generated number: " + number;
  }
});
SyncedCron.start();
