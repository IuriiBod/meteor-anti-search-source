Template.createOrganizationPage.events({
  'submit form': function(e) {
    e.preventDefault();
    var orgName = e.target.name.value;
    if(!orgName.trim() || orgName.length < 3) {
      $("#createOrganizationPage").addClass("show");
      return alert('Minimum organization name length: 3');
    }
    var creationResult = FlowComponents.callAction('createOrganization', orgName);
    if(creationResult._result) {
      $("#createOrganizationPage").removeClass("show");
      e.target.reset();
    }
  }
});