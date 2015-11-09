Template.selectPos.onRendered(function () {
  $('.selectPosName').select2();
});

Template.selectPos.events({
  'click .add-pos-btn': function (e, t) {
    var name = t.$('.selectPosName').val();
    FlowComponents.callAction('addNewPos', name);
  }
});