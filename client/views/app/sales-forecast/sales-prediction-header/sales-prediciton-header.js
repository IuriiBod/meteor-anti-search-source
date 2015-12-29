Template.salesPredictionHeader.onCreated(function () {
  this.set('currentDate', HospoHero.getParamsFromRoute('date'));
});

Template.salesPredictionHeader.helpers({
  onDateChanged: function () {
    return function (weekDate) {
      Router.go('salesPrediction', {
        date: weekDate,
        category: HospoHero.getParamsFromRoute('category')
      });
    };
  }
});