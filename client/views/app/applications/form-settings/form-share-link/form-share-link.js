Template.formShareLink.helpers({
  linkToForm() {
    let area = HospoHero.getCurrentArea(Meteor.userId());
    return Router.url('recruitmentForm', {organizationId: area.organizationId})
  }
});

Template.formShareLink.events({
  'click .copy-to-clipboard'(event, tmpl){
    tmpl.$('.link-to-form').select();
  }
});