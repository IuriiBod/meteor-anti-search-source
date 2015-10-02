var component = FlowComponents.define("createOrganizationPage", function(props){});

component.action.createOrganization = function(orgName) {
  // TODO: Process billing account here

  // Create new organization
  Meteor.call("createOrganization", orgName, function(err) {
    if(err) {
      console.log(err);
      alert(err.reason);
    }
  });

  return true;
};