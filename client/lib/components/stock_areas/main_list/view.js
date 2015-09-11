Template.stockAreas.events({
  'submit form': function(event) {
    event.preventDefault();
    var name = $(event.target).find('[name=gareaName]').val();
    if(name) {
      Meteor.call("createGeneralArea", name.trim(), function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          $(event.target).find('[name=gareaName]').val("");
        }
      });
    }
  }
});