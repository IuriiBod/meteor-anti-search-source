Template.locationItem.helpers({
  isCurrentLocation: function (locationId) {
    return HospoHero.getCurrentArea().locationId === locationId;
  }
});

Template.locationItem.events({
  'click .archive-loc-btn': function (e, tmpl) {
    e.stopPropagation();
    Meteor.call('switchArchiveLocation', tmpl.data.location._id);
  }
});
