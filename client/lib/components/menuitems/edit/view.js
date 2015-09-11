Template.editMenuItem.helpers({
  'equal': function(a, b) {
    return (a === b);
  }
});

Template.editMenuItem.events({
  'click #showIngredientsList': function(event) {
    event.preventDefault();
    $("#ingredientsListModal").modal("show");
  },

  'click #addNewIngredient': function(event) {
    event.preventDefault();
    $("#addIngredientModal").modal('show');
  },

  'click #addNewJobItem': function(event) {
    event.preventDefault();
    Router.go("submitJobItem");
  },

  'click #showJobItemsList': function(event) {
    event.preventDefault();
    $("#jobItemListModal").modal("show");
  },

  'submit form': function(event) {
    event.preventDefault();
    var id = Session.get("thisMenuItem");
    var name = $(event.target).find('[name=name]').val().trim(); 
    var category = $(event.target).find('[name=category]').val().trim(); 
    var status = $(event.target).find('[name=status]').val().trim(); 
    var instructions = FlowComponents.child('menuItemEditorEdit').getState('content'); 
    var preps = $(event.target).find("[name=prep_qty]").get();;
    var ings = $(event.target).find("[name=ing_qty]").get();
    var salesPrice = $(event.target).find('[name=salesPrice]').val().trim(); 
    var image = $("#uploadedImageUrl").attr("src");

    var menu = MenuItems.findOne(id);
    Session.set("updatingMenu", menu);
    if(!name) {
      return alert("Add a unique name for the menu");
    }
    if(instructions) {
      if($('.note-editable').text() === "Add instructions here" || $('.note-editable').text() === "") {
        instructions = ""
      }
    }
    var info = {};
    if(menu.name != name) {
      info.name = name;
    }
    if(menu.instructions != instructions) {
      info.instructions = instructions;
    }
    if(menu.status != status) {
      info.status = status;
    }
    if(menu.image != image) {
      info.image = image;
    }

    salesPrice = parseFloat(salesPrice);
    salesPrice = Math.round(salesPrice * 100)/100;
    if(menu.salesPrice != salesPrice) {
      if(salesPrice == salesPrice) {
        info.salesPrice = salesPrice;
      }
    }

    var prep_doc = [];
    preps.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      var quantity = $(item).val();
      if(quantity) {
        quantity = parseFloat(quantity);
        if(quantity == quantity) {
          quantity = quantity;
        } else {
          quantity = 1;
        }
      } else {
        quantity = 1;
      }
      var doc = {
        "_id": dataid,
        "quantity": quantity
      }

      if(dataid && !(prep_doc.hasOwnProperty(dataid))) {
        if(menu.jobItems.hasOwnProperty(dataid)) {
          if(menu.jobItems[dataid] != quantity) {
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
    ings.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      var quantity = $(item).val();
      if(quantity) {
        quantity = parseFloat(quantity);
        if(quantity == quantity) {
          quantity = quantity;
        } else {
          quantity = 1;
        }
      } else {
        quantity = 1;
      }
      var doc = {
        "_id": dataid,
        "quantity": quantity
      }
      if(dataid && !(ing_doc.hasOwnProperty(dataid))) {
        if(menu.ingredients.hasOwnProperty(dataid)) {
          if(menu.ingredients[dataid] != quantity) {
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
    if(menu.category != category) {
      info.category = category;
    }
    FlowComponents.callAction('submit', id, info);
  },

  'click #uploadMenuItem': function(event) {
    event.preventDefault();
    filepicker.pickAndStore(
      {mimetype:"image/*", services: ['COMPUTER']}, 
      {},
      function(InkBlobs){
        var doc = (InkBlobs);
        if(doc) {
          var url = doc[0].url;
          var id = $(event.target).closest("form").attr("data-id");;
          Meteor.call("editMenuItem", id, {"image": url}, function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            }
          });
          $(".uploadedNewImageDiv").removeClass("hide");
          $("#uploadedImageUrl").attr("src", url);
        }
    });
  },
  
  'change select[name="category"]': function(e) {
    var id = e.target.dataset.id;
    var value = e.target.value;
    $(e.target).addClass("hide");
    $('.my-editable-link[data-name="category"]').removeClass("hide");
    if (id && value) {
      Meteor.call("updateMenuItemCategory", id, value, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  },
  
  'change select[name="status"]': function(e) {
    var id = e.target.dataset.id;
    var value = e.target.value;
    $(e.target).addClass("hide");
    $('.my-editable-link[data-name="status"]').removeClass("hide");
    if (id && value) {
      Meteor.call("updateMenuItemStatus", id, value, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  },

  'click .my-editable-link': function(e, tpl) {
    e.preventDefault();
    var name = e.target.dataset.name;

    $(e.target).addClass("hide");
    $('[name="'+name+'"]').removeClass("hide");
  }
});

Template.editMenuItem.rendered = function() {
  $("body").on("click", function(e) {
    var el = $(e.target);

    if (!el.hasClass("my-editable-link") && !el.hasClass("my-editable-select")) {
      $(".my-editable-select").addClass("hide");
      $(".my-editable-link").removeClass("hide");
    }
  });
}
