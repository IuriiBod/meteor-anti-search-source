Template.menuFilters.events({
  'change .menuStatus': function(event) {
    event.preventDefault();
    var category = Router.current().params.category;
    var status = $(event.target).val();
    Router.go("menuItemsMaster", {'category': category, "status": status});
  }
});

Template.menuFilters.helpers({
  'notArchive': function() {
    return Router.current().params.status != "archived";
  }
});
