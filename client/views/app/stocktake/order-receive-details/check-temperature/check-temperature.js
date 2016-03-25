Template.checkTemperature.events({
  'click .submit-temperature-button': function (event, tmpl) {
    event.preventDefault();
    let temperatureStr = tmpl.$('.temperature-input').val();
    let temperature = parseFloat(temperatureStr);

    if (_.isFinite(temperature)) {
      let order = tmpl.data;
      order.temperature = temperature;

      Meteor.call('updateOrder', order, HospoHero.handleMethodResult(function () {
        //close modal window
        ModalManager.getInstanceByElement(event.target).close();
      }));
    } else {
      HospoHero.error(`"${temperatureStr}" is wrong temperature value`);
    }
  }
});