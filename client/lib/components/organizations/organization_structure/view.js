Template.organizationStructure.events({
  'click .location-settings': function() {
    FlyoutManager.open('locationSettings', {locationId: this._id}, true);
  },

  'click .area-settings': function() {
    FlyoutManager.open('areaSettings', {areaId: this._id}, true);
  },

  'click .change-current-area': function(e) {
    e.preventDefault();
    FlowComponents.callAction('changeDefaultArea', this._id);
    Router.go('home');
    $("#organizationStructure").removeClass("show");
  }
});