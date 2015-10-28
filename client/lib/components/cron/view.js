Template.cronConfig.onRendered(function() {
  $('.editable').editable({
    type: 'select',
    mode: 'popup',
    display: false,
    value: FlowComponents.callAction('getShiftUpdateHour')._result,
    source: HospoHero.dateUtils.hours(),
    success: function(response, newValue) {
      var location = Locations.findOne({ _id: HospoHero.getCurrentArea().locationId });

      console.log('VAL', newValue);
      console.log('INTVAL', parseInt(newValue));

      location.shiftUpdateHour = parseInt(newValue);

      Meteor.call('editLocation', location, HospoHero.handleMethodResult(function() {
        HospoHero.success('Cron time was successfully changed!');
      }));
    }
  });
});