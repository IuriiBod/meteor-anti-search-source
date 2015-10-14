Template.cronConfig.events({
  'submit #shift-updates-cron': function(e, tpl) {
    e.preventDefault();
    var shiftUpdateHour = tpl.$('[name="shiftUpdatesHoursSelect"]').val();
    Meteor.call('updateShiftUpdateHour', shiftUpdateHour, function(err) {
      if(err) {
        HospoHero.error(err);
      } else {
        HospoHero.success('Time was successfully changed!');
      }
    })
  }
});


Template.cronConfig.onRendered(function() {
  $('.editable').editable({
    type: 'select',
    mode: 'popup',
    display: false,
    value: FlowComponents.callAction('getShiftUpdateHour')._result,
    source: HospoHero.dateUtils.hours(),
    success: function(response, newValue) {
      Meteor.call('updateShiftUpdateHour', newValue, function(err) {
        if(err) {
          HospoHero.error(err);
        } else {
          HospoHero.success('Cron time was successfully changed!');
        }
      });
    }
  });
});