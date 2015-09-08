Template.locationsList.events({
  'click .add-location': function(e) {
    e.preventDefault();
    $("#createLocation").addClass("show");
  }
})