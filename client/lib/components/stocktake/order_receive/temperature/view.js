Template.temperatureModal.events({
  'submit #temperatureForm': function(event) {
    event.preventDefault();
    var receiptId = Session.get("thisReceipt");
    var temp = $(event.target).find("[name=temperature]").val();
    if(temp) {
      var info = {"temperature": temp};
      Meteor.call("updateReceipt", receiptId, info, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          $("#temperatureModal").modal("hide");
        }
      });
    }
  }
});