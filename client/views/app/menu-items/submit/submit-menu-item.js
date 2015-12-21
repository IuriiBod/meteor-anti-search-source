Template.menuItemSubmitMainView.onCreated(function () {
  this.set('image', false);
  this.set('menuItemIngredients', []);
  this.set('menuItemJobs', []);
});


Template.menuItemSubmitMainView.helpers({
  statuses: function () {
    return HospoHero.misc.getMenuItemsStatuses(false);
  },

  categoriesList: function () {
    var currentAreaId = HospoHero.getCurrentAreaId();
    return Categories.find({"relations.areaId": currentAreaId});
  },

  initialHTML: function () {
    return "Add instructions here";
  },

  getOnIngredientsListChanged: function () {
    var tmpl = Template.instance();
    return function (newIngredientsList) {
      tmpl.set('menuItemIngredients', newIngredientsList);
    };
  },

  getOnJobItemsListChanged: function () {
    var tmpl = Template.instance();
    return function (newJobItemsList) {
      tmpl.set('menuItemJobs', newJobItemsList);
    };
  }
});


Template.menuItemSubmitMainView.events({
  'submit form': function (event, tmpl) {
    event.preventDefault();

    var instructions = tmpl.$('.summernote').summernote('code');
    if (instructions === "Add instructions here") {
      instructions = '';
    }

    var menuItemFieldsConfig = [
      'name', 'category', 'status', {
        name: 'salesPrice',
        transform: function (salesPrice) {
          return Math.round(parseFloat(salesPrice) * 100) / 100;
        }
      }
    ];

    var info = HospoHero.misc.getValuesFromEvent(event, menuItemFieldsConfig, true);

    _.extend(info, {
      image: tmpl.get('image') || '',
      instructions: instructions,
      ingredients: tmpl.get('menuItemIngredients'),
      jobItems: tmpl.get('menuItemJobs')
    });

    if (!info.name) {
      return alert("Add a unique name for the menu");
    }

    Meteor.call("createMenuItem", info, HospoHero.handleMethodResult(function (id) {
      Router.go("menuItemDetail", {_id: id});
    }));
  },

  'click .upload-image-button': function (event, tmpl) {
    event.preventDefault();
    filepicker.pickAndStore({mimetype: "image/*", services: ['COMPUTER']}, {},
      function (InkBlobs) {
        if (_.isArray(InkBlobs) && InkBlobs[0]) {
          tmpl.set('image', InkBlobs[0].url);
        }
      });
  }
});