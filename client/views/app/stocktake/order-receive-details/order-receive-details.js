Template.orderReceiveDetails.helpers({
  title() {
    let title = 'Supplier Orders Receive';
    let order = this.order;
    if (order && order.supplier) {
      let supplier = Suppliers.findOne({_id: order.supplierId});
      if (supplier) {
        title += " - [" + supplier.name + "]";
      }
    }
    return title;
  },

  isReceived() {
    return !!this.receivedBy;
  },

  hasTemperature(){
    return this.hasOwnProperty('temperature');
  }
});

Template.orderReceiveDetails.events({
  'click .mark-order-as-delivered-button': function (event, tmpl) {
    event.preventDefault();
    let order = tmpl.data;
    order.receivedBy = Meteor.userId();
    order.receivedDate = new Date();

    Meteor.call('updateOrder', order, HospoHero.handleMethodResult());
  },

  'keyup .receive-note-textarea': function (event, tmpl) {
    event.preventDefault();
    if (event.keyCode === 13) {
      let order = tmpl.data;
      order.receiveNote = event.target.value.trim();

      Meteor.call('updateOrder', order, HospoHero.handleMethodResult());
    }
  },

  'click .check-temperatures-button': function (event, tmpl) {
    event.preventDefault();
    let order = tmpl.data;
    ModalManager.open('checkTemperature', order);
  }
});

