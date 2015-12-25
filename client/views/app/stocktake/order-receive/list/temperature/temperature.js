Template.temperatureModal.events({
  'submit .temperature-form': function (event, tmpl) {
    event.preventDefault();
    var receiptId = tmpl.data.currentReceipt._id;
    var temp = $(event.target).find('temperature-input').val();
    if (temp) {
      var info = {'temperature': temp};
      Meteor.call('updateReceipt', receiptId, info, HospoHero.handleMethodResult(function () {
        $('#temperatureModal').modal('hide');
      }));
    }
  }
});