Template.composeMail.events({
  'click .sendEmail': function (event) {
    event.preventDefault();
    var mailBody = FlowComponents.child('composeMailEditorSubmit').getState('content');
    var title = $(".emailTitle").val();
    var to = $(".emailTo").val();

    var orderType = "emailed";
    var supplier = Session.get("activeSupplier");
    var version = Session.get("thisVersion");
    var address = to;
    var deliveryDate = parseInt(moment().add(1, 'day').format('x'));
    var info = {
      "through": orderType,
      "details": address,
      "deliveryDate": deliveryDate,
      "to": to,
      "title": title,
      "emailText": mailBody
    };
    Meteor.call("generateReceipts", version, supplier, info, HospoHero.handleMethodResult());
    $("#composeMailModal").modal("hide");
  }
});