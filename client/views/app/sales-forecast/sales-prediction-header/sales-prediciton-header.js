Template.salesPredictionHeader.helpers({
  currentDate: function () {
    return moment(HospoHero.getParamsFromRoute('date'));
  },

  onDateChanged: function () {
    return function (weekDate) {
      Router.go('salesPrediction', {
        date: weekDate,
        category: HospoHero.getParamsFromRoute('category')
      });
    };
  }
});