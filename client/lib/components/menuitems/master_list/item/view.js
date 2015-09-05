Template.menuItem.events({
  'click .menu-item-delete': function(event) {
    event.preventDefault();
    var result = confirm("Are you sure, you want to delete this menu ?");
    if(result) {
      var id = $(event.target).attr("data-id");
      if(id) {
        Meteor.call("deleteMenuItem", id, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
    }
  },

  'click .archiveMenuItem': function(e, tpl) {
    e.preventDefault();
    var i, id;
    if($(e.target).hasClass('fa')) {
      i = $(e.target);
    } else {
      i = $(e.target).find('.fa');
    }
    id = i.parent().attr("data-id");

    Meteor.call("archiveMenuItem", id, function(err) {
      if(err) {
        console.log(err);
        alert(err.reason);
      }
    });
    i.parent().parent().remove();
  }
});
