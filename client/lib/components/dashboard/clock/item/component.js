var component = FlowComponents.define("clockItem", function(props) {
  this.item = props.item;
  this.item["text"] = props.text;
  this.item["class"] = props.class;
  this.item["tag"] = props.tag;
  this.item["subText"] = props.subText;

  this.onRendered(this.onClockRendered);
});

component.state.item = function() {
  if(this.item) {
    return this.item;
  }
};

component.state.timeFromNow = function() {
  if(this.item.text == "Clock In") {
    return this.get("timeLeft");
  } else if(this.item.text == "Clock Out") {
    return this.get("timeSpent");
  } else if(this.item.text == "Clock Ended") {
    var shiftId = Session.get("newlyEndedShift");
    var shift = Shifts.findOne(shiftId);
    var time = 0;
    if(shift) {
      time = shift.finishedAt - shift.startedAt;
      return time;
    }
  }
};

component.state.clockIn = function() {
  return this.item.text == "Clock In";
};

component.state.clockOut = function() {
  return this.item.text == "Clock Out";
};


component.state.clockEnded = function() {
  return this.item.text == "Clock Ended";
};

component.prototype.onClockRendered = function() {
  var self = this;
  var clock;
  if(this.item) {
    if(this.item.text == "Clock In") {
      var upplerLimit = new Date().getTime() + 5 * 3600 * 1000;
      var lowerLimit = new Date().getTime() - 2 * 3600 * 1000;

      clock = new Date(this.item.startTime).getTime();
      var timeLeft = function() {
        if(clock > lowerLimit && clock < upplerLimit) {
          clock--;
          self.set("timeLeft", clock);
          return false;
        } else {
          self.set("timeLeft", null);
        }
      };
      var intervalleft = Meteor.setInterval(timeLeft, 1000);
    } else if(this.item.text == "Clock Out") {
      clock = new Date(this.item.startedAt).getTime();
      var timeSpent = function() {
        if(clock < new Date().getTime()) {
          clock--;
          var spent = new Date().getTime() - clock;
          self.set("timeSpent", spent);
          return false;
        }
      };
      var intervalspent = Meteor.setInterval(timeSpent, 1000);
    }
  }
};