Template.composeMail.events({
  'click .sendEmail': function(event) {
    event.preventDefault();
    var mailBody = FlowComponents.child('composeMailEditorSubmit').getState('content');
    var title = $(".emailTitle").val();
    var to = $(".emailTo").val();
    console.log("........email....", mailBody, title, to);

    var orderType = "emailed";
    var supplier = Session.get("activeSupplier");
    var version = Session.get("thisVersion");
    var address = to;
    var deliveryDate = moment().add(7, 'days');
    deliveryDate = moment(deliveryDate).format("YYYY-MM-DD");
    var info = {
      "through": orderType,
      "details": address,
      "deliveryDate": new Date(deliveryDate).getTime(),
      "to": to,
      "title": title,
      "emailText": mailBody
    }
    Meteor.call("generateReceipts", version, supplier, info, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
    $("#composeMailModal").modal("hide");
  }
});