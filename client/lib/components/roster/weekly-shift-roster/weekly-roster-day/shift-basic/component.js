// TODO: Check this function
function editShift(obj) {
  Meteor.call("editShift", obj._id, obj, HospoHero.handleMethodResult(function() {
    var shift = Shifts.findOne(obj._id);

  }));
}

