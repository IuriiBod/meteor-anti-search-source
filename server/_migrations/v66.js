Migrations.add({
  version: 66,
  name: 'delete all shifts from Top Paddocks weekly rosters',
  up: function () {
    var shiftsFromArea = Shifts.find({type: null, 'relations.areaId': 'ox5ttWxpAgKbguRd5'});

    if (shiftsFromArea.count()) {
      shiftsFromArea.forEach(function (shift) {
        Shifts.remove({_id: shift._id});
      });
    }
  }
});