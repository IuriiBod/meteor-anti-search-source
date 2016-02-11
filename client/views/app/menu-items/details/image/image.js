Template.menuItemImage.helpers({
  imageOptions() {
    return {
      namespace: 'menus',
      type: 'images',
      name: 'Image',
      url: '#',
      className: 'upload-image-button',
      icon: 'fa fa-cloud-upload'
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