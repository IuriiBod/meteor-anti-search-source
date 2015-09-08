Template.organizationDetailsPage.events({
  'click .delete-organization': function() {
    if(confirm("Are you sure, you want to delete this organization?")) {

      // TODO: Delete organization
    }
  },

  'click .open-flyout': function(e) {
    var span = e.target;
    if(span.className.indexOf('fa') >= 0) {
      span = span.parentNode;
    }
    var flyoutId = span.dataset.id;
    document.getElementById(flyoutId).classList.add("show");
  }
})