var component = FlowComponents.define("clock", function(props) {
  Meteor.subscribe("daily", moment().format("YYYY-MM-DD"), Meteor.userId());
});

component.state.clockInPermission = function() {
  var upplerLimit = moment().add(2, 'hours').toDate();
  var lowerLimit = moment().subtract(2, 'hours').toDate();

  var query = {
    assignedTo: Meteor.userId(),
    status: 'draft',
    $and: [{
      "startTime": {
        $gte: lowerLimit
      }
    }, {
      "startTime": {
        $lte: upplerLimit
      }
    }]
  };

  query["relations.areaId"] = HospoHero.getCurrentArea()._id;

  var shift = Shifts.findOne(query, {sort: {"startTime": 1}});
  this.set("inShift", shift);
  return !!shift;
};

component.state.clockOutPermission = function() {
  var query = {
    assignedTo: Meteor.userId(),
    status: 'started'
  };
  var shift = Shifts.findOne(query);
  this.set("outShift", shift);
  return !!shift;
};

component.state.clockIn = function() {
  var shift = this.get("inShift");
  if(shift) {
    return shift;
  }
};

component.state.subText = function() {
  var inshift = this.get("inShift");
  if(inshift && inshift.startTime <= Date.now()) {
    return "Today shift started ";
  } else {
    return "Today shift starts ";
  }
};

component.state.clockOut = function() {
  var shift = this.get("outShift");
  if(shift) {
    return shift;
  }
};

component.state.shiftEnded = function() {
  var shiftId = Session.get("newlyEndedShift");
  var shift = Shifts.findOne(shiftId);
  if(shift) {
    return shift;
  }
};