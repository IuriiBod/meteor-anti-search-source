// should be removed/replaced after merge
Template.jobItemEdit.helpers({
  item: function () {
    return getPrepItem(Template.instance().data._id);
  },
  quantity: function () {
    return 1;
  }
});

Template.jobItemEdit.events({
  'click .removePrep': function (event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var localMenuId = Session.get("localId");
    var localMenu = LocalMenuItem.findOne(localMenuId);
    if (localMenu && localMenu.ings.length > 0) {
      LocalMenuItem.update({"_id": localMenuId}, {$pull: {"preps": id}});
    }
    var item = $(event.target).closest("tr");
    $(item).remove();
  },

  'keypress .prep-qty': function (event) {
    if (event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var elem = $(event.target);
      $(elem).closest("tr").next().find("input").focus();
    }
  }
});