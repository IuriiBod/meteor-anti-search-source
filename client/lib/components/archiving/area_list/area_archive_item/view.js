Template.areaArchiveItem.events({
  "click .archive-loc-btn": function (e) {
    e.stopPropagation();
    var area = FlowComponents.callAction("getArea")._result;
    Meteor.call("switchArchiveArea", area);
  }
});

Template.areaArchiveItem.helpers({
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