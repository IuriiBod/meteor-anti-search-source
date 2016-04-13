Template.menuDetailsHeaderTitle.onRendered(function () {
  let menuItemId = this.data._id;
  this.$('.menu-item-name-editable').editable({
    type: 'text',
    title: 'Edit menu name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: function (response, newValue) {
      let menuItem = MenuItems.findOne({_id: menuItemId});
      menuItem.name = newValue;
      Meteor.call('editMenuItem', menuItem, HospoHero.handleMethodResult());
    }
  });
});
