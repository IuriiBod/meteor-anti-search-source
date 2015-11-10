Template.selectPos.onRendered(function () {
  $('.selectPosName').select2();
});

Template.selectPos.events({
  'click .add-pos-btn': function (event, tmpl) {
    var name = tmpl.$('.selectPosName').val();
    FlowComponents.callAction('addNewPos', name);
  }
});