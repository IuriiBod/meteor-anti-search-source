Template.areaArchiveItem.events({
  'click .archive-area-btn': function (e, tmpl) {
    e.stopPropagation();
    Meteor.call('switchArchiveArea', tmpl.data.area._id);
  }
});

Template.areaArchiveItem.helpers({
  isCurrentArea: function (areaId) {
    return HospoHero.getCurrentAreaId() === areaId;
  }
});