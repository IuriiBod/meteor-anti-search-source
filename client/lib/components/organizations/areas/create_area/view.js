Template.createArea.events({
  'change input[type="radio"]': function(e, tpl) {
    FlowComponents.callAction('changeEnabled');
  },
  'submit form': function(e) {
    e.preventDefault();
    var name = e.target.name.value;
    var locationId = e.target.locationId.value;
    var status = e.target.status.value;

    var creatingResult = FlowComponents.callAction('createArea', name, locationId, status);
    if(creatingResult._result) {
      e.target.reset();
      $("#createArea").removeClass("show");
      $("#locationSettings").removeClass("show");
    }
  },
  'click .close-flyout': function() {
    $("#createArea").removeClass("show");
  }
});