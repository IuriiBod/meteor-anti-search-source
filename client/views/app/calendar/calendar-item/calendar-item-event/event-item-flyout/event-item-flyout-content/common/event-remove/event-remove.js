Template.eventRemove.events({
  'click .remove-event': function (event, tmpl) {
    Meteor.call('removeCalendarEvent', tmpl.data.event, HospoHero.handleMethodResult(function () {
      var flyout = FlyoutManager.getInstanceByElement(event.target);
      flyout.close();
    }));
  }
});