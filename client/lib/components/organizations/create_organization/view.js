Template.createOrganizationPage.events({
  'submit form': function(e) {
    e.preventDefault();
    var orgName = e.target.name.value;
    if(!orgName.trim() || orgName.length < 3) {
      HospoHero.getBlazeTemplate('#createOrganizationPage').showCreateOrgFlyout.set(true);
      return alert('Minimum organization name length: 3');
    }
    var creationResult = FlowComponents.callAction('createOrganization', orgName);
    if(creationResult._result) {
      HospoHero.getBlazeTemplate('#createOrganizationPage').showCreateOrgFlyout.set(false);
      e.target.reset();
    }
  }
});