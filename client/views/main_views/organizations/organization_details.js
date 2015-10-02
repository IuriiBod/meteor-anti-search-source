Template.organizationDetails.helpers({
  'organizationName': function() {
    var org = Organizations.findOne();
    return org.name;
  }
});