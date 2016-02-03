Template.menuDetailPerformance.onRendered(function () {
  var self = this;
  var onPriceEditSuccess = function (response, newValue) {
    var menuItem = MenuItems.findOne({_id: self.data._id});
    menuItem.salesPrice = parseFloat(newValue);
    Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
  };

  $('.edit-item-price').editable({
    type: "text",
    title: 'Edit sale price',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: onPriceEditSuccess
  });
});

Template.menuDetailPerformance.helpers({
  menuItemStats: function () {
    var menu = this;

    return HospoHero.analyze.menuItem(menu);
  }
});