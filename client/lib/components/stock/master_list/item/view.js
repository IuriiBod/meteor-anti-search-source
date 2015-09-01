Template.ingredientItemDetailed.events({
  'click .editIngredient': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Session.set("thisIngredientId", id);
    $("#editIngredientModal").modal("show");
  },

  'click .archiveIngredient': function(e, tpl) {
    e.preventDefault();
    var button, i, id;
    if($(e.target).hasClass('archiveIngredient')) {
      button = $(e.target);
      i = button.find('.fa');
    } else {
      i = $(e.target);
      button = i.parent();
    }
    id = button.parent().parent().attr("data-id");
    Meteor.call("archiveIngredient", id, function(err) {
      if(err) {
        console.log(err);
        alert(err.reason);
      }
    });
    i.toggleClass('fa-dropbox').toggleClass('fa-archive');
  }
});
