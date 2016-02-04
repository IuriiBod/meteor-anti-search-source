Template.posEditItem.onRendered(function () {
});

Template.posEditItem.events({
  'click .delete-pos-name': function (event, tmpl) {
    Meteor.call('togglePosNameToMenuItem', tmpl.data.item._id, tmpl.data.name, 'delete', HospoHero.handleMethodResult());
  }
});