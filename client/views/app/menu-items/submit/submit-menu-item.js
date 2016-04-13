var DEFAULT_INSTRUCTIONS = 'Add instructions here';

Template.menuItemSubmitMainView.onCreated(function () {
  this.image = new ReactiveVar(false);
  this.menuItemIngredients = new ReactiveVar([]);
  this.menuItemJobs = new ReactiveVar([]);
});


Template.menuItemSubmitMainView.helpers({
  image: function () {
    return Template.instance().image.get();
  },
  menuItemIngredients: function () {
    return Template.instance().menuItemIngredients.get();
  },
  menuItemJobs: function () {
    return Template.instance().menuItemJobs.get();
  },
  statuses: function () {
    return HospoHero.misc.getMenuItemsStatuses(false);
  },

  categoriesList: function () {
    var currentAreaId = HospoHero.getCurrentAreaId();
    return Categories.find({"relations.areaId": currentAreaId});
  },

  initialHTML: function () {
    return DEFAULT_INSTRUCTIONS;
  },

  getOnIngredientsListChanged: function () {
    var tmpl = Template.instance();
    return function (newIngredientsList) {
      tmpl.menuItemIngredients.set(newIngredientsList);
    };
  },

  getOnJobItemsListChanged: function () {
    var tmpl = Template.instance();
    return function (newJobItemsList) {
      tmpl.menuItemJobs.set(newJobItemsList);
    };
  }
});


Template.menuItemSubmitMainView.events({
  'submit form': function (event, tmpl) {
    event.preventDefault();

    var instructions = tmpl.$('.summernote').summernote('code');
    if (instructions === DEFAULT_INSTRUCTIONS) {
      instructions = '';
    }

    var menuItemFieldsConfig = [
      'name', 'category', 'status', {
        name: 'salesPrice',
        transform: function (salesPrice) {
          return HospoHero.misc.rounding(parseFloat(salesPrice));
        }
      }
    ];

    var info = HospoHero.misc.getValuesFromEvent(event, menuItemFieldsConfig, true);

    _.extend(info, {
      image: tmpl.image.get() || '',
      instructions: instructions,
      ingredients: tmpl.menuItemIngredients.get(),
      jobItems: tmpl.menuItemJobs.get(),
      relations: HospoHero.getRelationsObject()
    });

    if (!info.name) {
      return HospoHero.error("Add a unique name for the menu");
    }

    if (isNaN(info.salesPrice)) {
      return HospoHero.error("Price should be a number");
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
          tmpl.image.set(InkBlobs[0].url);
        }
      });
  }
});