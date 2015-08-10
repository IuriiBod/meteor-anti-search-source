var component = FlowComponents.define("ordersReceiptsList", function(props) {});

component.state.list = function() {
  var state = Session.get("thisState");
  var time = Session.get("thisTime");
  if(time == "week") {
    var thisWeek = getWeekStartEnd(moment().week());
    return OrderReceipts.find({
      "received": state, 
      "expectedDeliveryDate": {
        $gte: new Date(thisWeek.monday).getTime(),
        $lte: new Date(thisWeek.sunday).getTime()
      }
    }, {sort: {"receivedDate": -1}});
  } else if(time == "month") {
    var thisMonth = getDaysOfMonth(moment());
    return OrderReceipts.find({
      "received": state, 
      "expectedDeliveryDate": {
        $gte: new Date(thisMonth.start).getTime(),
        $lte: new Date(thisMonth.end).getTime()
      }
    }, {sort: {"receivedDate": -1}});
  } else {
    return OrderReceipts.find({"received": state}, {sort: {"receivedDate": -1}});
  }
}

component.state.toBeReceived = function() {
  var state = Session.get("thisState");
  if(!state) {
    return true;
  } else {
    return false;
  }
}

component.state.received = function() {
  var state = Session.get("thisState");
  if(state) {
    return true;
  } else {
    return false;
  }
}

component.state.week = function() {
  var time = Session.get("thisTime");
  if(time && time == "week") {
    return true;
  } else {
    return false;
  }
}

component.state.month = function() {
  var time = Session.get("thisTime");
  if(time && time == "month") {
    return true;
  } else {
    return false;
  }
}

component.state.allTime = function() {
  var time = Session.get("thisTime");
  if(time && time == "all") {
    return true;
  } else {
    return false;
  }
}