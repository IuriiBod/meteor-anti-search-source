var component = FlowComponents.define("stockTakeMasterList", function() {
  this.onRendered(this.onListRender);
});

component.state.listOfDates = function() {
  return this.get("historyList");
};

component.prototype.onListRender = function() {
  var self = this;
  Meteor.call("stockTakeHistory", function(err, list) {
    if(err) {
      HospoHero.error(err);
    } else {
      self.set("historyList", list);
    }
  });

  subs.subscribe("stocktakeMains", new Date().getTime());
};