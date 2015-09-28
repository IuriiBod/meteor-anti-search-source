var component = FlowComponents.define("stockTakeMasterList", function() {
  this.onRendered(this.onListRender);
});

component.state.listOfDates = function() {
  var list = this.get("historyList");
  if(list) {
    return list;
  }
}

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
}