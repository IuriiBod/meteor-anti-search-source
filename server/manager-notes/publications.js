Meteor.publishComposite('managerNotes', function (weekRange, areaId) {
  return {
    find: function () {
      if (this.userId) {
        return ManagerNotes.find({
          noteDate: weekRange,
          'relations.areaId': areaId
        });
      }
      else {
        this.ready();
      }
    },
    children: [
      {
        find: function (note) {
          if (this.userId) {
            return Meteor.users.find({_id: note.createdBy}, {
              fields: {
                'profile.firstName': 1,
                'profile.lastName': 1,
                username: 1
              }
            });
          } else {
            this.ready();
          }
        }
      }
    ]
  }
});