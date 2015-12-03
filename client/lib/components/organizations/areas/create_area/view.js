Template.createArea.onRendered(function() {
  this.$("input[name='name']").focus();
});

Template.createArea.events({
  'change input[type="radio"]': function() {
    FlowComponents.callAction('changeEnabled');
  },

  'submit form': function(e) {
    e.preventDefault();

    var areaInfo = HospoHero.misc.getValuesFromEvent(e, ['name', 'locationId'], true);
    FlowComponents.callAction('createArea', areaInfo, e.target);
  }
});