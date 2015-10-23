Template.quantity.onRendered(function () {
  var menuItemId = Router.current().params._id;
  var item = FlowComponents.callAction("getItem")._result;
  this.$('.quantity').editable({
    mode: "popup",
    type: "text",
    autotext: 'auto',
    title: "Enter quantity",
    display: false,
    success: function (response, newValue) {
      if (newValue) {
        newValue = parseFloat(newValue);
        newValue = !isNaN(newValue) ? newValue : 0;

        item.type = item.type=="ings"?"ingredients":"jobItems";
        Meteor.call('editMenuIngredientsOrJobItems', menuItemId, {"_id": item.id, "quantity": newValue}, item.type, HospoHero.handleMethodResult());
      }
    }
  });
});