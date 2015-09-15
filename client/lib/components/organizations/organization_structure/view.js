Template.organizationStructure.events({
  'click .location-settings': function() {
    FlowComponents.callAction('changeLocation', this._id);
    $('.location-name').editable('setValue', this.name);
  },
  'click .area-settings': function() {
    $('.area-name').editable('setValue', this.name);
  },
  'click .change-current-area': function(e) {
    e.preventDefault();
    Session.set('currentAreaId', this._id);
  }
});