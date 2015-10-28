Template.settingsMenuItem.events({
  'click #showIngredientsList': function(event, tmpl) {
    event.preventDefault();
    tmpl.$("#ingredientsListModal").modal("show");
  },

  'click #addNewIngredient': function (event, tmpl) {
    event.preventDefault();
    tmpl.$("#addIngredientModal").modal('show');
  },

  'click #addNewJobItem': function (event) {
    event.preventDefault();
    Router.go("submitJobItem");
  },

  'click #showJobItemsList': function (event, tmpl) {
    event.preventDefault();
    tmpl.$("#jobItemListModal").modal("show");
  },

  'submit form': function (event) {
    event.preventDefault();
    var id = Session.get("thisMenuItem");
    var name = $(event.target).find('[name=name]').val().trim();
    var category = $(event.target).find('[name=category]').val().trim();
    var status = $(event.target).find('[name=status]').val().trim();
    var instructions = FlowComponents.child('menuItemEditorEdit').getState('content');
    var preps = $(event.target).find("[name=prep_qty]").get();
    var ings = $(event.target).find("[name=ing_qty]").get();
    var salesPrice = $(event.target).find('[name=salesPrice]').val().trim();
    var image = $("#uploadedImageUrl").attr("src");

    var menu = MenuItems.findOne(id);
    Session.set("updatingMenu", menu);
    if (!name) {
      return alert("Add a unique name for the menu");
    }
    if (instructions) {
      if ($('.note-editable').text() === "Add instructions here" || $('.note-editable').text() === "") {
        instructions = ""
      }
    }
    var info = {};
    if (menu.name != name) {
      info.name = name;
    }
    if (menu.instructions != instructions) {
      info.instructions = instructions;
    }
    if (menu.status != status) {
      info.status = status;
    }
    if (menu.image != image) {
      info.image = image;
    }

    salesPrice = parseFloat(salesPrice);
    salesPrice = Math.round(salesPrice * 100) / 100;
    if (menu.salesPrice != salesPrice) {
      if (salesPrice == salesPrice) {
        info.salesPrice = salesPrice;
      }
    }

    var prep_doc = [];
    preps.forEach(function (item) {
      var dataid = $(item).attr("data-id");
      var quantity = parseFloat($(item).val());
      var doc = {
        "_id": dataid,
        "quantity": quantity
      };

      if (dataid && !(prep_doc.hasOwnProperty(dataid))) {
        if (menu.jobItems.hasOwnProperty(dataid)) {
          if (menu.jobItems[dataid] != quantity) {
            prep_doc.push(doc);
          }
        } else {
          prep_doc.push(doc);
        }
      } else {
        prep_doc.push(doc);
      }
    });

    var ing_doc = [];
    ings.forEach(function (item) {
      var dataid = $(item).attr("data-id");
      var quantity = parseFloat($(item).val());
      var doc = {
        "_id": dataid,
        "quantity": quantity
      };
      if (dataid && !(ing_doc.hasOwnProperty(dataid))) {
        if (menu.ingredients.hasOwnProperty(dataid)) {
          if (menu.ingredients[dataid] != quantity) {
            ing_doc.push(doc);
          }
        } else {
          ing_doc.push(doc);
        }
      } else {
        ing_doc.push(doc);
      }
    });

    info.jobItems = prep_doc;
    info.ingredients = ing_doc;
    if (menu.category != category) {
      info.category = category;
    }
    FlowComponents.callAction('submit', id, info);
  },

  'click #uploadMenuItem': function (event) {
    event.preventDefault();
    var menuId = Router.current().params._id;

    filepicker.pickAndStore(
      {mimetype: "image/*", services: ['COMPUTER']},
      {},
      function (InkBlobs) {
        var doc = (InkBlobs);
        if(doc) {
          var url = doc[0].url;
          var id = $(event.target).closest("form").attr("data-id");
          Meteor.call("editMenuItem", id, {"image": url}, HospoHero.handleMethodResult());
          $(".uploadedNewImageDiv").removeClass("hide");
          $("#uploadedImageUrl").attr("src", url);
        }
      });
  },

  'click .remove-image': function() {
    var menuId = Router.current().params._id;
    Meteor.call('editMenuItem', menuId, {image: ''}, HospoHero.handleMethodResult());
  },

  'click .deleteMenuItemBtn': function (e) {
    e.preventDefault();
    var result = confirm("Are you sure, you want to delete this menu ?");
    if (result) {
      var id = $(event.target).attr("data-id");
      if (id) {
        Meteor.call("deleteMenuItem", id, HospoHero.handleMethodResult(function () {
          Router.go("menuItemsMaster", {"category": "all", "status": "all"});
        }));
      }
    }
  },

  'click .cancelBtn': function (event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Router.go("menuItemDetail", {"_id": id});
  },

  'change select[name="category"]': function (e) {
    var id = e.target.dataset.id;
    var value = e.target.value;
    $(e.target).addClass("hide");
    $('.my-editable-link[data-name="category"]').removeClass("hide");
    if (id && value) {
      Meteor.call("editMenuItem", id, {category: value}, HospoHero.handleMethodResult());
    }
  },

  'change select[name="status"]': function (e) {
    var id = e.target.dataset.id;
    var value = e.target.value;
    $(e.target).addClass("hide");
    $('.my-editable-link[data-name="status"]').removeClass("hide");
    if (id && value) {
      Meteor.call("editMenuItem", id, {status: value}, HospoHero.handleMethodResult());
    }
  },

  'click .my-editable-link': function (e) {
    e.preventDefault();
    var name = e.target.dataset.name;
    $(e.target).addClass("hide");
    $('[name="'+name+'"]').removeClass("hide");
  },

  'mouseenter .menuImageDiv': function(event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').show();
  },

  'mouseleave .menuImageDiv': function(event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').hide();
  }
});

Template.settingsMenuItem.rendered = function() {
  $("body").on("click", function(e) {
    var el = $(e.target);
    if (!el.hasClass("my-editable-link") && !el.hasClass("my-editable-select")) {
      $(".my-editable-select").addClass("hide");
      $(".my-editable-link").removeClass("hide");
    }
  });
};