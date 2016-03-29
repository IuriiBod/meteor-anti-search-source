Template.orderingStatus.onCreated(function () {
  this.markOrderAsOrderedThrough = function (orderType) {
    let order = this.data;
    if (orderType === 'emailed') {
      ModalManager.open('composeStocktakeOrderingEmail', order);
    } else {
      var newInfo = {
        orderedThrough: {
          type: orderType,
          date: new Date()
        },
        expectedDeliveryDate: moment().add(1, 'days').toDate()
      };

      let updatedOrder = _.extend(order, newInfo);

      Meteor.call('updateOrder', updatedOrder, HospoHero.handleMethodResult());
    }
  };
});


Template.orderingStatus.helpers({
  orderSentDetails: function () {
    return this && (this.orderedThrough.type === "emailed" && "Email sent " || "Phoned ") +
      moment(this.orderedThrough.date).format("MMMM Do YYYY, h:mm:ss a");
  }
});


Template.orderingStatus.events({
  'click .order-emailed-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.markOrderAsOrderedThrough('emailed');
  },

  'click .order-phoned-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.markOrderAsOrderedThrough('phoned');
  }
});


