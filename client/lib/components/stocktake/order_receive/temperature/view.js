Template.temperatureModal.events({
  'submit #temperatureForm': function(event) {
    event.preventDefault();
    var receiptId = Session.get("thisReceipt");
    var temp = $(event.target).find("[name=temperature]").val();
    if(temp) {
      var info = {"temperature": temp};
      Meteor.call("updateReceipt", receiptId, info, function(err) {
        if(err) {
          HospoHero.error(err);
        } else {
          $("#temperatureModal").modal("hide");
        }
      });
    }
  }
});