Template.staffCostTr.helpers({
  formatActual: function () {
    return Math.round(this.sales.actual).toLocaleString();
  },

  formatForecast: function () {
    return Math.round(this.sales.forecast).toLocaleString();
  },

  textClass: function () {
    return 'text-' + (this.sales.actual <= this.sales.forecast ? 'info' : 'danger');
  }
});


