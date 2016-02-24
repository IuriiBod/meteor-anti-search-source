Template.inactivityTimeoutField.helpers({
  inactivityTimeout: function () {
    return StaleSession.inactivityTimeout / 60000;
  }
});


Template.inactivityTimeoutField.events({
  "change .inactivity-timeout-field": function (event) {
    var area = Areas.findOne({_id: HospoHero.getCurrentAreaId()});
    var value = parseInt(event.target.value);
    area.inactivityTimeout = value * 60000;
    Meteor.call('editArea', area, HospoHero.handleMethodResult());
  }
});