Template.createArea.events({
  'change input[type="radio"]': function(e, tpl) {
    FlowComponents.callAction('changeEnabled');
  },
  'submit form': function(e) {
    e.preventDefault();

    var areaInfo = {
      name: e.target.name.value,
      locationId: e.target.locationId.value
    };

    FlowComponents.callAction('createArea', areaInfo);
    e.target.reset();
    $("#createArea").removeClass("show");
    $("#locationSettings").removeClass("show");
  },

  'click .close-flyout': function() {
    $("#createArea").removeClass("show");
  }
});