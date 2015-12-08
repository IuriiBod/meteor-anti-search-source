Template.posEditItem.onRendered(function () {
});

Template.posEditItem.events({
  'click .delete-pos-name': function (event, tmpl) {
    Meteor.call('deletePosNameFromMenuItem', tmpl.data.item._id, tmpl.data.name, HospoHero.handleMethodResult());
  }
});

