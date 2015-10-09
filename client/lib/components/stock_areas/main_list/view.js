Template.stockAreas.events({
  'submit form': function(event) {
    event.preventDefault();
    var name = $(event.target).find('[name=gareaName]').val();
    if(name) {
      Meteor.call("createGeneralArea", name.trim(), function(err) {
        if(err) {
          HospoHero.alert(err);
        } else {
          $(event.target).find('[name=gareaName]').val("");
        }
      });
    }
  }
});