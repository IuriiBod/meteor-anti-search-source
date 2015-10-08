Template.jobItemEdit.events({
  'click .removePrep': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var jobItemsList = Session.get("selectedJobItems");
    if(jobItemsList) {
      if(jobItemsList.length > 0) {
        var index = jobItemsList.indexOf(id);
        if(index >= 0) {
          jobItemsList.splice(index, 1);
          Session.set("selectedJobItems", jobItemsList);
        }
      }
    }
    var item = $(event.target).closest("tr");
    $(item).remove();
  },

  'keypress .prep-qty': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var elem = $(event.target);
      $(elem).closest("tr").next().find("input").focus();
    }
  }
});