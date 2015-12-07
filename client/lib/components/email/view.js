Template.composeMail.events({
  'click .sendEmail': function (event) {
    event.preventDefault();
    var mailBody = FlowComponents.child('composeMailEditorSubmit').getState('content');
    var title = $(".emailTitle").val();
    var to = $(".emailTo").val();

    FlowComponents.callAction('sendEmail', mailBody, title, to);
    $("#composeMailModal").modal("hide");
  }
});