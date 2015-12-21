Template.areaArchiveItem.events({
  "click .archive-loc-btn": function (e, tmpl) {
    e.stopPropagation();
    var area = tmpl.data.area;
    Meteor.call("switchArchiveArea", area);
  }
});

Template.areaArchiveItem.helpers({
  isCurrentArea: function (areaId) {
    HospoHero.getCurrentAreaId() === areaId;
  },
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