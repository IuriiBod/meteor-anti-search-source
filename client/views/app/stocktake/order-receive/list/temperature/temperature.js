Template.temperatureModal.events({
  'submit .temperature-form': function (event, tmpl) {
    event.preventDefault();
    var $form  =$(event.target);
    var temp = $form.find('.temperature-input').val();
    var receiptId = tmpl.data.currentReceipt._id;
    if (temp) {
      var info = {'temperature': temp};
      Meteor.call('updateReceipt', receiptId, info, HospoHero.handleMethodResult(function () {
        $('#temperatureModal').modal('hide');
      }));
    }
  }
});