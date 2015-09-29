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
    }, {sort: {"receivedDate": -1, "supplier": 1}});
  } else if(time == "month") {
    var thisMonth = getDaysOfMonth(moment());
    return OrderReceipts.find({
      "received": state, 
      "expectedDeliveryDate": {
        $gte: new Date(thisMonth.start).getTime(),
        $lte: new Date(thisMonth.end).getTime()
      }
    }, {sort: {"receivedDate": -1, "supplier": 1}});
  } else {
    return OrderReceipts.find({"received": state}, {sort: {"receivedDate": -1, "supplier": 1}});
  }
};

component.state.toBeReceived = function() {
  var state = Session.get("thisState");
  return !state;
};

component.state.received = function() {
  var state = Session.get("thisState");
  return !!state;
};

component.state.week = function() {
  var time = Session.get("thisTime");
  return !!(time && time == "week");
};

component.state.month = function() {
  var time = Session.get("thisTime");
  return !!(time && time == "month");
};

component.state.allTime = function() {
  var time = Session.get("thisTime");
  return !!(time && time == "all");
};