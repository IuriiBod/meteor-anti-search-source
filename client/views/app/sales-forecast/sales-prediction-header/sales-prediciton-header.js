Template.salesPredictionHeader.onCreated(function () {
  this.set('currentDate', HospoHero.misc.getWeekDateFromRoute(Router.current()));
});

Template.salesPredictionHeader.helpers({
  onDateChanged: function () {
    return function (weekDate) {
      weekDate.category = Router.current().params.category;
      Router.go('salesPrediction', weekDate);
    };
  }
});