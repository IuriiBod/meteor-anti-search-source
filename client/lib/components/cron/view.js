Template.cronConfig.onRendered(function() {
  $('.editable').editable({
    type: 'select',
    mode: 'popup',
    display: false,
    value: FlowComponents.callAction('getShiftUpdateHour')._result,
    source: HospoHero.dateUtils.hours(),
    success: function(response, newValue) {
      var location = Locations.findOne({ _id: HospoHero.getCurrentArea().locationId });
      location.shiftUpdateHour = newValue;

      Meteor.call('editLocation', location, HospoHero.handleMethodResult(function() {
        HospoHero.success('Cron time was successfully changed!');
      }));
    }
  });
});