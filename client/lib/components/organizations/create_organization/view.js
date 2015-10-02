Template.createOrganizationPage.events({
  'submit form': function(e) {
    e.preventDefault();
    var orgName = e.target.name.value;
    var fly;
    if(!orgName.trim() || orgName.length < 3) {
      fly = HospoHero.getBlazeTemplate('#createOrganizationPage');
      if(fly) {
        fly.showCreateOrgFlyout.set(true);
      }
      return alert('Minimum organization name length: 3');
    }
    var creationResult = FlowComponents.callAction('createOrganization', orgName);
    if(creationResult._result) {
      fly = HospoHero.getBlazeTemplate('#createOrganizationPage');
      if(fly) {
        fly.showCreateOrgFlyout.set(true);
      }
      e.target.reset();
    }
  }
});