Template.wrongQuantityModal.events({
  'click .update-quantity-button': function (event, tmpl) {
    event.preventDefault();

    let receivedCountStr = tmpl.$('.received-count-input').val();
    let receivedCount = parseFloat(receivedCountStr);

    if (_.isFinite(receivedCount) && receivedCount >= 0) {
      let orderItem = tmpl.data;
      orderItem.receivedCount = HospoHero.misc.rounding(receivedCount);

      Meteor.call('updateOrderItem', orderItem, HospoHero.handleMethodResult(() => {
        ModalManager.getInstanceByElement(event.target).close();
      }));
    } else {
      HospoHero.error(`"${receivedCountStr}" is incorrect value. It should be positive number.`);
    }
  }
});