Template.organizationStructure.events({
  'click .location-settings': function() {
    FlowComponents.callAction('changeLocation', this._id);
    $('.location-name').editable('setValue', this.name);
  },
  'click .area-settings': function() {
    FlowComponents.callAction('changeArea', this._id);
    $('.area-name').editable('setValue', this.name);
  },
  'click .change-current-area': function(e) {
    e.preventDefault();
    FlowComponents.callAction('changeDefaultArea', this._id);
    Router.go('home');
    $("#organizationStructure").removeClass("show");
  }
});