var component = FlowComponents.define("stockTakeMasterList", function() {
  this.onRendered(this.onListRender);
});

component.state.listOfDates = function() {
  return this.get("historyList");
};

component.prototype.onListRender = function() {
  var self = this;
  Meteor.call("stockTakeHistory", HospoHero.handleMethodResult(function(list) {
    self.set("historyList", list);
  }));
};