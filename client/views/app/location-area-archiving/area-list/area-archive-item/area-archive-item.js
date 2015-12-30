Template.areaArchiveItem.events({
  'click .archive-area-btn': function (e, tmpl) {
    e.stopPropagation();
    var area = tmpl.data.area;
    Meteor.call('switchArchiveArea', area);
  }
});

Template.areaArchiveItem.helpers({
  isCurrentArea: function (areaId) {
    return HospoHero.getCurrentAreaId() === areaId;
  }
});