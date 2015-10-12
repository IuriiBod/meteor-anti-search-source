Template.createOrganizationPage.events({
  'submit form': function(e) {
    e.preventDefault();
    var orgName = e.target.name.value;

    if(!orgName.trim() || orgName.length < 3) {
      return alert("Minimum organization name length: 3");
    }

    // TODO: Process billing account here

    // Create new organization
    Meteor.call("createOrganization", orgName, function(err) {
      if(err) {
        HospoHero.error(err);
      } else {
        Router.go('home');
      }
    });
  }
});