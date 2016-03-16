Template.newStocktakeModal.onRendered(function() {
  this.newStocktakemodalInstance = ModalManager.getInstanceByElement(this.$('.new-stocktake-modal'));
});

Template.newStocktakeModal.events({
  'click .createNewStocktake': function (event, tmpl) {
    event.preventDefault();
    tmpl.newStocktakemodalInstance.close();
    var date = moment().format("YYYY-MM-DD");
    Meteor.call("createMainStocktake", date, HospoHero.handleMethodResult(function (id) {
      Router.go("stocktakeCounting", {"_id": id});
    }));
  },

  'click .gotoExistingStocktake': function (event, tmpl) {
    event.preventDefault();
    tmpl.newStocktakemodalInstance.close();
    var date = moment().format("YYYY-MM-DD");
    date = new Date(date).getTime();
    var stocktakeLatest = Stocktakes.findOne({date: date}, {sort: {date: -1}});
    if (stocktakeLatest) {
      Router.go("stocktakeCounting", {"_id": stocktakeLatest._id});
    }
  }
});