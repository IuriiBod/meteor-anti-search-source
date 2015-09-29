var component = FlowComponents.define("ordersReceiptsList", function(props) {});

component.state.list = function() {
  var state = Session.get("thisState");
  var time = Session.get("thisTime");
  if(time == "week") {
    return OrderReceipts.find({
      "received": state, 
      "expectedDeliveryDate": {
        $gte: moment().startOf("week").unix() * 1000,
        $lte: moment().endOf("week").unix() * 1000
      }
    }, {sort: {"receivedDate": -1, "supplier": 1}}).fetch();
  } else if(time == "month") {
    return OrderReceipts.find({
      "received": state, 
      "expectedDeliveryDate": {
        $gte: moment().startOf("month").unix() * 1000,
        $lte: moment().endOf("month").unix() * 1000
      }
    }, {sort: {"receivedDate": -1, "supplier": 1}}).fetch();
  } else {
    return OrderReceipts.find({"received": state}, {sort: {"receivedDate": -1, "supplier": 1}}).fetch();
  }
};

component.state.toBeReceived = function() {
  return !Session.get("thisState");
};

component.state.received = function() {
  return !!Session.get("thisState");
};

component.state.week = function() {
  var time = Session.get("thisTime");
  return time && time == "week";
};

component.state.month = function() {
  var time = Session.get("thisTime");
  return time && time == "month";
};

component.state.allTime = function() {
  var time = Session.get("thisTime");
  return time && time == "all";
};