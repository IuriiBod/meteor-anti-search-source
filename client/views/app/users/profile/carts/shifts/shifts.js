var getStartOfDay = function () {
  return moment().startOf('d').toDate();
};

Template.rosteredShifts.helpers({
  rosteredForShifts: function () {
    if (this) {
      return Shifts.find({
        assignedTo: this._id,
        startTime: {$gte: getStartOfDay()}
      }, {sort: {startTime: 1}});
    }
  },
  openedShifts: function () {
    var currentUserId = Meteor.userId();

    if (this._id === currentUserId) {
      if (this.profile.resignDate) {
        return Shifts.find({
          assignedTo: null,
          published: true,
          $and: [
            {startTime: {$gte: getStartOfDay()}},
            {startTime: {$lt: this.profile.resignDate}}
          ]
        }, {sort: {startTime: 1}}).fetch();
      } else {
        return Shifts.find({
          assignedTo: null,
          published: true,
          startTime: {$gte: getStartOfDay()}
        }, {sort: {startTime: 1}}).fetch();
      }
    } else {
      return Shifts.find({
        assignedTo: null,
        startTime: {$gte: getStartOfDay()}
      }, {sort: {startTime: 1}});
    }
  }
});