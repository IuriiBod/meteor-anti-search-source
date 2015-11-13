Meteor.publish('managerNotes', function(weekRange, areaId) {
  if(this.userId) {
    return ManagerNotes.find({
      noteDate: weekRange,
      'relations.areaId': areaId
    });
  } else {
    this.ready();
  }
});