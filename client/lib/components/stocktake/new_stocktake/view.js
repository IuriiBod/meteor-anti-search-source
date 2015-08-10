Template.newStocktakeModal.events({
  'click .createNewStocktake': function(event) {
    event.preventDefault();
    $("#newStocktakeModal").modal("hide")
    var date = moment().format("YYYY-MM-DD");
    Meteor.call("createMainStocktake", date, function(err, id) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        Meteor.call("generateStocktakes", new Date(date).getTime(), function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
          Router.go("stocktakeCounting", {"_id": id})
        });
      }
    });
  }
});