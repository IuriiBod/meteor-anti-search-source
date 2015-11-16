Template.ingsAndPreps.events({
  'click .remove-ings': function (event) {
    event.preventDefault();
    var menu = Session.get("thisMenuItem");
    var id = $(event.target).attr("data-id");
    var confirmRemove = confirm("Are you sure you want to remove this item?");
    if (confirmRemove) {
      Meteor.call("removeItemFromMenu", menu, {ingredients: {_id: id}}, HospoHero.handleMethodResult(function () {
        $(event.target).closest("tr").remove()
      }));
    }
  },

  'click .remove-prep': function (event) {
    event.preventDefault();
    var menu = Session.get("thisMenuItem");
    var id = $(event.target).attr("data-id");
    var confirmRemove = confirm("Are you sure you want to remove this item ?");
    if (confirmRemove) {
      Meteor.call("removeItemFromMenu", menu, {jobItems: {_id: id}}, HospoHero.handleMethodResult(function () {
        $(event.target).closest("tr").remove()
      }));
    }
  },

  'click .view-prep': function (event) {
    event.preventDefault();
    var id = event.target.dataset.id;
    Session.set("goBackMenu", id);
    Router.go('jobItemEdit', {_id: id});
  },

  'click .view-ings': function (event) {
    event.preventDefault();
    var id = event.target.dataset.id;
    Session.set("thisIngredientId", id);
    $("#editIngredientModal").modal("show");
  }
});