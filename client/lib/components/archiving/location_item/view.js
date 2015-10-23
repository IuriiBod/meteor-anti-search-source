Template.locationItem.events({
  "click .archive-loc-btn": function (e) {
    e.stopPropagation();
    var location = FlowComponents.callAction("getLocation")._result;
    Meteor.call("switchArchiveLocation", location);
  }
});