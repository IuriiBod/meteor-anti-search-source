Template.menuItemSubmitMainView.onCreated(function () {
  this.set('image', false);
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
  }
});

Template.menuItemSubmitMainView.events({
  'submit form': function (event, tmpl) {
    event.preventDefault();

    var instructions = tmpl.$('.summernote').summernote('code');
    if (instructions === "Add instructions here") {
      instructions = '';
    }

    //todo: get rid of this mess too
    var preps = $(event.target).find("[name=prep_qty]").get();
    var ings = $(event.target).find("[name=ing_qty]").get();
    var ing_doc = [];
    ings.forEach(function (item) {
      var dataid = $(item).attr("data-id");
      if (dataid && !(ing_doc.hasOwnProperty(dataid))) {
        var quantity = parseFloat($(item).val());
        quantity = quantity ? quantity : 1;
        ing_doc.push({
          "_id": dataid,
          "quantity": quantity
        });
      }
    });
    var prep_doc = [];
    preps.forEach(function (item) {
      var dataid = $(item).attr("data-id");
      if (dataid && !(prep_doc.hasOwnProperty(dataid))) {
        var quantity = parseFloat($(item).val());
        quantity = quantity ? quantity : 1;
        prep_doc.push({
          "_id": dataid,
          "quantity": quantity
        });
      }
    });


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
      ingredients: ing_doc,
      prepItems: prep_doc
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