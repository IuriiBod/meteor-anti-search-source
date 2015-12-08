Template.menuItem.events({
  'click .menu-item-delete': function (event) {
    event.preventDefault();
    var result = confirm("Are you sure, you want to delete this menu ?");
    if (result) {
      var id = $(event.target).attr("data-id");
      if (id) {
        Meteor.call("deleteMenuItem", id, HospoHero.handleMethodResult());
      }
    }
  },

  'click .archiveMenuItem': function (e, tpl) {
    e.preventDefault();
    var i, id;
    if ($(e.target).hasClass('fa')) {
      i = $(e.target);
    } else {
      i = $(e.target).find('.fa');
    }
    id = i.parent().attr("data-id");

    Meteor.call("archiveMenuItem", id, HospoHero.handleMethodResult());
    i.parent().parent().remove();
  }
});
