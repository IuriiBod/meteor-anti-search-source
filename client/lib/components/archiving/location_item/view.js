Template.locationItem.events({
  "click .archive-loc-btn": function (e) {
    e.stopPropagation();
    var location = FlowComponents.callAction("getLocation")._result;
    Meteor.call("switchArchiveLocation", location);
  }
});

Template.locationItem.helpers({
  btnSettings: function (archived) {
    var settings = {
      btnClass: "btn-default",
      text: "archive"
    };
    if (archived) {
      settings.btnClass = "btn-danger";
      settings.text = "unarchive";
    }
    return settings;
  }
});