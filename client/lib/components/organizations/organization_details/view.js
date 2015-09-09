Template.organizationDetailsPage.events({
  'click .delete-organization': function() {
    if(confirm("Are you sure, you want to delete this organization?")) {
      var id = Session.get('organizationId');
      Meteor.call('deleteOrganization', id, function(err) {
        if(err) {
          console.log(err);
          alert(err.reason);
        }
      });
      Session.set('organizationId', '');
      $('#organizationDetailsPage').removeClass('show');
      $('#organizationStructure').removeClass('show');
    }
  }
})