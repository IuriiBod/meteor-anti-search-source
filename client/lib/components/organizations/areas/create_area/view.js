Template.createArea.events({
  'change input[type="radio"]': function() {
    FlowComponents.callAction('changeEnabled');
  },

  'submit form': function(e) {
    e.preventDefault();

    var areaInfo = HospoHero.misc.getValuesFromEvent(e, ['name', 'locationId'], true);
    FlowComponents.callAction('createArea', areaInfo);
    e.target.reset();
    $("#createArea").removeClass("show");
    $("#locationSettings").removeClass("show");
  },

  'click .close-flyout': function() {
    $("#createArea").removeClass("show");
  }
});