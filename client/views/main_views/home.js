Template.home.helpers({
  'name': function() {
    var user = Meteor.user();
    if(user) {
      var name = user.username + " ";
      var index = name.indexOf(" ") + 1;
      name = name.slice(0, name.indexOf(" "));
      return name;
    }
  }
});

Template.home.events({
  'click .create-organization': function() {
    var topNavigationTemplate = HospoHero.getBlazeTemplate('#createOrganizationPage');
    if(topNavigationTemplate) {
      topNavigationTemplate.showCreateOrgFlyout.set(true);
    }
  }
});