var component = FlowComponents.define("ordersReceiptsList", function(props) {  
});

component.state.list = function() {
  var state = Session.get("thisState");
  var time = Session.get("thisTime");
  var data = null;
  var ids = [];

  if(time == "week") {
    var thisWeek = getWeekStartEnd(moment().week());
    data = OrderReceipts.find({
      "received": state, 
      "expectedDeliveryDate": {
        $gte: new Date(thisWeek.monday).getTime(),
        $lte: new Date(thisWeek.sunday).getTime()
      }
    }, {sort: {"receivedDate": -1, "supplier": 1}});

  } else if(time == "month") {
    var thisMonth = getDaysOfMonth(moment());
    data = OrderReceipts.find({
      "received": state, 
      "expectedDeliveryDate": {
        $gte: new Date(thisMonth.start).getTime(),
        $lte: new Date(thisMonth.end).getTime()
      }
    }, {sort: {"receivedDate": -1, "supplier": 1}});

  } else if(time == "all") {
    data = OrderReceipts.find({"received": state}, {sort: {"receivedDate": -1, "supplier": 1}});
  }
  data = data.fetch();
  if(data && data.length > 0) {
    var users = [];
    var suppliers = [];
    if(data && data.length > 0) {
      data.forEach(function(receipt) {
        if(ids && ids.indexOf(receipt._id) < 0) {
          ids.push(receipt._id);
        }
        if(receipt.receivedBy && users.indexOf(receipt.receivedBy) < 0) {
          users.push(receipt.receivedBy);
        }
        if(suppliers.indexOf(receipt.supplier) < 0) {
          suppliers.push(receipt.supplier);
        }
      });
    }
    if(users.length > 0) {
      subs.subscribe("selectedUsers", users);
    }
    if(suppliers.length > 0) {
      subs.subscribe("suppliers", suppliers);
    }
    if(ids.length > 0) {
      subs.subscribe("receiptOrders", ids);
    }
    return data;
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