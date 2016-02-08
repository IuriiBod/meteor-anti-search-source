Template.menuItemImage.helpers({
  collapsed() {
    return this.uiStates.getUIState('images');
  }
});

Template.menuItemImage.events({
  'click .upload-image-button': function (event, tmpl) {
    filepicker.pickAndStore(
      {mimetype: "image/*", services: ['COMPUTER']},
      {},
      function (InkBlobs) {
        var doc = (InkBlobs);
        if (doc && doc.length) {
          var menuItem = MenuItems.findOne({_id: tmpl.data.item._id});
          menuItem.image = doc[0].url;
          Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
        }
      });
  },

  'shown.bs.collapse #Image': _.throttle(function (event, tmpl) {
    tmpl.data.uiStates.setUIState('images', true);
  }, 1000),

  'hidden.bs.collapse #Image': _.throttle(function (event, tmpl) {
    tmpl.data.uiStates.setUIState('images', false);
  }, 1000)
});