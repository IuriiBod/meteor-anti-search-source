var component = FlowComponents.define("currentStockData", function(props) {
  this.onRendered(this.onListRendered);
});

component.state.stockIds = function() {
  var data = this.get("data");
  var stockIds = [];
  
  if(data) {
    data.forEach(function(item) {
      if(stockIds.indexOf(item._id.stockId) < 0) {
        stockIds.push(item._id.stockId);
      }
    });
  }
  if(stockIds && stockIds.length > 0) {
    subs.subscribe("ingredients", stockIds);
  }
  return stockIds;
}

component.state.countByDate = function(stockId) {
  var result = [];
  var week = getDatesFromWeekNumber(parseInt(Session.get("thisWeek")));
  week.forEach(function(day) {
    var doc = CurrentStocksLocal.findOne({"date": new Date(day.date), "stockId": stockId});
    if(doc) {
      result.push(doc.count);
    } else {
      result.push("-");
    }
  });
  if(result && result.length > 0) {
    return result;
  }
}

component.prototype.onListRendered = function() {
  var self = this;
  var weekNo = Session.get("thisWeek");
  if(weekNo) {
    Tracker.autorun(function() {
      var week = getWeekStartEnd(weekNo);
      Meteor.call("readDaily", week.monday, week.sunday, function(err, data) {
        if(err) {
          console.log(err);
        } else {
          self.set("data", data);
          if(data && data.length > 0) {
            data.forEach(function(doc) {
              var item = {
                "stockId": doc._id.stockId,
                "date": doc._id.date,
                "count": doc.count
              }
              CurrentStocksLocal.insert(item);
            });
          }
        }
      });
    });

  }
}