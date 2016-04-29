Template.wrongPriceModal.onRendered(function () {
  this.$('[data-toggle="popover"]').popover();
  this.$('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
});


Template.wrongPriceModal.events({
  'click .save-new-price-button': function (event, tmpl) {
    event.preventDefault();
    let newPriceStr = tmpl.$('.new-price-input').val();
    let newPrice = parseFloat(newPriceStr);

    if (_.isFinite(newPrice) && newPrice > 0) {
      let updateIngredientPrice = $('.update-stock-price-input:checked').val();
      let orderItem = tmpl.data;
      let ingredient = tmpl.data.ingredient;
      ingredient.costPerPortion = newPrice;

      let closeModalFn = () => {
        ModalManager.getInstanceByElement(event.target).close();
      };

      let onOrderItemUpdatedSuccess = () => {
        if (updateIngredientPrice) {
          Meteor.call('editIngredient', ingredient, HospoHero.handleMethodResult(closeModalFn));
        } else {
          closeModalFn();
        }
      };

      orderItem.ingredient.originalCost = orderItem.ingredient.cost;
      orderItem.ingredient.cost = newPrice;

      Meteor.call('updateOrderItem', orderItem, HospoHero.handleMethodResult(onOrderItemUpdatedSuccess));
    } else {
      HospoHero.error(`"${newPriceStr}" should be positive number.`);
    }
  }
});