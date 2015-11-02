Template.areaArchiveItem.events({
  "click .archive-loc-btn": function(e){
    e.stopPropagation();
    var area = FlowComponents.callAction("getArea")._result;
    Meteor.call("switchArchiveArea", area);
  }
});