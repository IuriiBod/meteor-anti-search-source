Template.ingsAndPreps.events({
  'click .remove-ings': function(event) {
    event.preventDefault();
    var menu = Session.get("thisMenuItem");
    var id = $(event.target).attr("data-id");
    var confirmRemove = confirm("Are you sure you want to remove this item ?");
    if(confirmRemove) {
      Meteor.call("removeMenuIngredient", menu, id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          $(event.target).closest("tr").remove()
        }
      });
    }
  },

  'click .remove-prep': function(event) {
    event.preventDefault();
    var menu = Session.get("thisMenuItem");
    var id = $(event.target).attr("data-id");
    var confirmRemove = confirm("Are you sure you want to remove this item ?");
    if(confirmRemove) {
      Meteor.call("removeMenuJobItem", menu, id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          $(event.target).closest("tr").remove()
        }
      });
    }
  },

  'click .view-prep': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Session.set("goBackMenu", Session.get("thisMenuItem"));
    Router.go("jobItemEdit", {"_id": id});
  },

  'click .view-ings': function(event) {
    // event.preventDefault();
    var id = $(event.target).attr("data-id");
    Session.set("thisIngredientId", id);
    $("#editIngredientModal").modal("show");
  }
});

Template.ingsAndPreps.rendered = function() {
  $.fn.editable.defaults.mode = 'inline';
  $.fn.editable.defaults.showbuttons = true;

  var menu = Session.get("thisMenuItem");
  // if(managerPlusAdminPermission()) {
    $('.quantity').editable({
      success: function(response, newValue) {
        if(newValue) {
          var ing = $(this).data("pk");
          var type = $(this).data("itemtype");
          if(type == "ings") {
            Meteor.call("addMenuIngredients", menu, [{"_id": ing, "quantity": newValue}], function(err) {
              if(err) {
                console.log(err);
                return alert(err.reason);
              }
              return;
            });
          } else if(type == "prep") {
            Meteor.call("addMenuPrepItems", menu, [{"_id": ing, "quantity": newValue}], function(err) {
              if(err) {
                console.log(err);
                return alert(err.reason);
              }
              return;
            });
          }
        }
      }
    });
  // }
}