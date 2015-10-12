Template.organizationDetailsPage.events({
  'click .delete-organization': function(e) {
    e.preventDefault();
    if(confirm("Are you sure, you want to delete this organization?")) {
      var id = e.target.dataset.id;
      Meteor.call('deleteOrganization', id, function(err) {
        if(err) {
          HospoHero.error(err);
        }
      });
      $('.flyout-container').removeClass('show');
    }
  }
});