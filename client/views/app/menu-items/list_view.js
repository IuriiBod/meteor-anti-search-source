Template.menuItemsListMainView.events({
  'click #submitMenuItem': function(event) {
    event.preventDefault();
    Router.go("submitMenuItem");
  }
});