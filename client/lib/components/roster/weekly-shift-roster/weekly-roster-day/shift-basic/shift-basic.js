Template.shiftBasic.events({
  'click .remove-shift-button': function (event, tmpl) {
    event.preventDefault();
    Meteor.call("deleteShift", tmpl.data._id, HospoHero.handleMethodResult());
  }
});