var component = FlowComponents.define("stockTakeMasterList", function() {
  this.onRendered(this.onListRender);
});

component.state.listOfDates = function() {
  return this.get("historyList") ? this.get("historyList") : false;
};

component.prototype.onListRender = function() {
  var self = this;
  Meteor.call("stockTakeHistory", function(err, list) {
    if(err) {
      HospoHero.alert(err);
    } else {
      self.set("historyList", list);
    }
  });

  var date = moment().format("YYYY-MM-DD");
  subs.subscribe("stocktakeMains", new Date(date).getTime());
};