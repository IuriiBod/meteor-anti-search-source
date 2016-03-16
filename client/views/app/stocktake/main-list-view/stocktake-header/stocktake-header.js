Template.stocktakeHeader.events({
  'click #startNewStocktake': function (event) {
    event.preventDefault();
    let localDateMoment = HospoHero.dateUtils.getDateMomentForLocation(new Date(), HospoHero.getCurrentArea().locationId);

    let existingStocktake = Stocktakes.findOne({
      date: localDateMoment.startOf('day')
    });

    let createNewStocktake = () => {
      Meteor.call("createStocktake", HospoHero.handleMethodResult(function (newStocktakeId) {
        Router.go("stocktakeCounting", {_id: newStocktakeId});
      }));
    };

    if (existingStocktake) {
      swal({
        title: "Important..!",
        text: "You already have a stocktake for this day. Do you want to create a new one?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Go to latest existing stocktake",
        cancelButtonText: "Create new stocktake",
        closeOnConfirm: false,
        closeOnCancel: false
      }, function (isGoToLatestStocktake) {
        if (isGoToLatestStocktake) {
          Router.go("stocktakeCounting", {_id: existingStocktake._id});
        } else {
          createNewStocktake();
        }
      });
    } else {
      createNewStocktake();
    }
  }
});