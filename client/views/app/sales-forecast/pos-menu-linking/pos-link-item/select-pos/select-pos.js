Template.selectPos.onRendered(function () {
  $('.selectPosName').select2();
});

Template.selectPos.helpers({
  allPos: function () {
    return PosMenuItems.find();
  }
});

Template.selectPos.events({
  'click .add-pos-btn': function (event, tmpl) {
    var name = tmpl.$('.selectPosName').val();
    Meteor.call('togglePosNameToMenuItem', tmpl.data.item._id, name, 'add', HospoHero.handleMethodResult());
  }
});