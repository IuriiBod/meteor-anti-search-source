var migrationFn = function () {
  Shifts.update({}, {
    $unset: {
      shiftDate: 1
    }
  }, {
    multi: true
  });

  Shifts.find({
    $or: [
      {
        startedAt: {
          $ne: null
        }
      },
      {
        finishedAt: {
          $ne: null
        }
      }
    ]
  }).forEach(function(shift) {
    var startedAtStamp = shift.startedAt;
    var finishedAtStamp = shift.finishedAt;
    var set = {};

    if(startedAtStamp) {
      set.startedAt = new Date(startedAtStamp);
    }
    if(finishedAtStamp) {
      set.finishedAt = new Date(finishedAtStamp);
    }

    Shifts.update({
      _id: shift._id
    }, {
      $set: set
    });
  });
};


Migrations.add({
  version: 19,
  name: "Changing shift started/finished at time to Date",
  up: migrationFn
});
