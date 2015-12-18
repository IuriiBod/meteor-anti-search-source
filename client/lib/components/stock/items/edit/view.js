Template.ingredientItemEdit.helpers({
  item: function () {
    if (this._id) {
      var item = getIngredientItem(this._id);
      if (item) {
        if (this.quantity) {
          item.quantity = this.quantity;
        }
        return item;
      }
    }
  }
});

Template.ingredientItemEdit.events({
  'click .removeIng': function (event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var localMenuId = Session.get("localId");
    var localMenu = LocalMenuItem.findOne(localMenuId);
    if (localMenu && localMenu.ings.length > 0) {
      LocalMenuItem.update({"_id": localMenuId}, {$pull: {"ings": id}});
    }
    var item = $(event.target).closest('tr');
    $(item).remove();
  },

  'keypress .ing-qty': function (event) {
    if (event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var elem = $(event.target);
      $(elem).closest("tr").next().find("input").focus();
    }
  }
});