Template.checkTemperature.events({
  'click .submit-temperature-button': function (event, tmpl) {
    event.preventDefault();
    var temperature = tmpl.find('.temperature-input').val();
    if (temperature) {
      let order = tmpl.data;
      order.temperature = temperature;
      
      Meteor.call('updateOrder', order, HospoHero.handleMethodResult(function () {
        //close modal window
        ModalManager.getInstanceByElement(event.target).close();
      }));
    }
  }
});