var CurrentStocksLocal = new Mongo.Collection(null);

var component = FlowComponents.define("currentStockData", function (props) {
  this.onRendered(this.onListRendered);
});

component.state.stockIds = function () {
  var data = this.get("data");
  //console.log('data: ', data);
  var stockIds = [];

  if (data) {
    data.forEach(function (item) {
      if (stockIds.indexOf(item._id.stockId) < 0) {
        stockIds.push(item._id.stockId);
      }
    });
  }
  return stockIds;
};

component.state.countByDate = function (stockId) {
  var result = [];
  var week = getDatesFromWeekNumber(parseInt(Session.get("thisWeek")));
  week.forEach(function (day) {
    var doc = CurrentStocksLocal.findOne({"date": new Date(day.date), "stockId": stockId});
    if (doc) {
      result.push(doc.count);
    } else {
      result.push("-");
    }
  });
  return result && result.length > 0 ? result : false;
};

component.prototype.onListRendered = function () {
  var self = this;
  var weekNo = Session.get("thisWeek");
  if (weekNo) {
    Tracker.autorun(function () {
      var week = getWeekStartEnd(weekNo);
      Meteor.call("readDaily", week.monday, week.sunday, HospoHero.handleMethodResult(function (data) {
        self.set("data", data);
        if (data && data.length > 0) {
          data.forEach(function (doc) {
            var item = {
              "stockId": doc._id.stockId,
              "date": doc._id.date,
              "count": doc.count
            };
            CurrentStocksLocal.insert(item);
          });
        }
      }));
    });
  }
};