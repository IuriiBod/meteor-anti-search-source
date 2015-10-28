Template.listOfJobItems.events({
  'click #showJobItemsList': function(event,tmpl) {
    event.preventDefault();
    tmpl.$("#jobItemListModal").modal("show");
  }
});