Template.organizationStructure.events({
  'click .location-settings': function() {
    Session.set('locationId', this._id);
    $('.location-name').editable('setValue', this.name);
  },
  'click .area-settings': function() {
    Session.set('areaId', this._id);
    $('.area-name').editable('setValue', this.name);
  },
  'click .change-current-area': function(e) {
    e.preventDefault();
    Session.set('currentAreaId', this._id);
  }
});