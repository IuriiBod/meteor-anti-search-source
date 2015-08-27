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
  }
});
