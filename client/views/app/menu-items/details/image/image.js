Template.menuItemImage.helpers({
  imageSettings() {
    let buttons = [];
    let checker = new HospoHero.security.PermissionChecker();

    if (checker.hasPermissionInArea(null, `edit menus`)) {
      let imageUpload = {
        url: '#',
        className: 'upload-image-button',
        icon: 'fa fa-cloud-upload'
      };
      buttons.push(imageUpload);
    }

    return {
      namespace: 'menus',
      uiStateId: 'images',
      title: 'Image',
      contentPadding: '20px',
      buttons: buttons
    }
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
          var menuItem = MenuItems.findOne({_id: tmpl.data._id});
          menuItem.image = doc[0].url;
          Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
        }
      });
  }
});