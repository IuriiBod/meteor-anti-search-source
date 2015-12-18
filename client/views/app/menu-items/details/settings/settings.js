Template.menuItemSettings.helpers({
  currentCategory: function () {
    return Categories.findOne({_id: this.category});
  },

  categoryOptions: function () {
    return Categories.find().map(function (category) {
      return {
        value: category._id,
        text: category.name
      };
    });
  },

  statusOptions: function () {
    return HospoHero.misc.getMenuItemsStatuses(false).map(function (status) {
      return {
        value: status,
        text: status
      };
    });
  },

  getOnCategoryChanged: function () {
    var tmpl = Template.instance();
    return function (newCategory) {
      console.log('newCategory', newCategory);
      //Meteor.call("editMenuItem", tmpl.data._id, {category: newCategory}, HospoHero.handleMethodResult());
    };
  },

  getOnStatusChanged: function () {
    var tmpl = Template.instance();
    return function (newStatus) {
      Meteor.call("editMenuItem", tmpl.data._id, {status: newStatus}, HospoHero.handleMethodResult());

    }
  },

  isArchived: function () {
    return this.status == "archived";
  }
});

Template.menuItemSettings.events({
  'click .upload-image-button': function (event, tmpl) {
    filepicker.pickAndStore(
      {mimetype: "image/*", services: ['COMPUTER']},
      {},
      function (InkBlobs) {
        var doc = (InkBlobs);
        if (doc) {
          var url = doc[0].url;
          Meteor.call("editMenuItem", tmpl.data._id, {"image": url}, HospoHero.handleMethodResult());
        }
      });
  },

  'click .remove-image': function (event, tmpl) {
    Meteor.call('editMenuItem', tmpl.data._id, {image: ''}, HospoHero.handleMethodResult());
  }
});


