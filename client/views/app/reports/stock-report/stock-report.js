Template.stockReport.onCreated(function () {
  this.reports = new ReactiveArray();

  this.getRouteParams = (currentStocktake) => {
    return {
      date: currentStocktake.date.replace(/\//g, '-'),
      stocktakeMainId: currentStocktake.stocktakeMainId
    };
  };

  this.uploadNextStockReport = () => {
    //todo: implement it using new stocktake
  };

  this.uploadNextStockReport();
});

Template.stockReport.helpers({
  reports: function () {
    return Template.instance().reports.list();
  }
});

Template.stockReport.events({
  'click #load-stocktake-report': function (event, tmpl) {
    tmpl.uploadNextStockReport();
  },

  'click .first-stocktake-total': function (event, tmpl) {
    event.preventDefault();
    Router.go('stockTotalValueDetails', tmpl.getRouteParams(this.firstStocktake));
  },

  'click .second-stocktake-total': function (event, tmpl) {
    event.preventDefault();
    Router.go('stockTotalValueDetails', tmpl.getRouteParams(this.secondStocktake));
  },

  'click .difference-text': function (event) {
    event.preventDefault();

    let params = {
        firstStocktakeDate: this.firstStocktake.date.replace(/\//g, '-'),
        secondStocktakeDate: this.secondStocktake.date.replace(/\//g, '-')
    };

    Router.go('stockVarianceReport', params);
  }
});
