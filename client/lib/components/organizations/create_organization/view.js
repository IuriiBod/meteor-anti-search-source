Template.createOrganizationPage.events({
  'submit form': function(e) {
    e.preventDefault();
    var orgName = e.target.name.value;

    // TODO: Process billing account here

    //Finding the organization with the same name
    var orgCount = Organizations.find({name: orgName}).count();

    if(orgCount > 0) {
      alert("The organization with name "+orgName+" already exists!");
      return false;
    }
    // TODO: Add billing account info to the doc variable
    var doc = {
      name: orgName
    };
    var orgId;

    // Create new organization
    Meteor.call("createOrganization", doc, function(err, id) {
      if(err) {
        console.log(err);
        alert(err.reason);
      }
      orgId = id;
    });

    // TODO: The problem with setting the session variable

    e.target.reset();
    $("#createOrganizationPage").removeClass("show");
  }
});