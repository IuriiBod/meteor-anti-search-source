Template.jobItemsModalList.events({
  'keyup #searchText-box': function(event) {
    var text = $(event.target).val().trim();
    FlowComponents.callAction('keyup', text);
  },

  'click #addNewJobItem': function(event) {
    event.preventDefault();
    $("#jobItemListModal").modal("hide");
    Router.go("submitJobItem");
  }
});