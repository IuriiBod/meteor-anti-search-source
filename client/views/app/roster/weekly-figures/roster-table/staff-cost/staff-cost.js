Template.staffCostTr.helpers({
  formatActual: function () {
    return Math.round(this.staff.actual).toLocaleString();
  },

  formatForecast: function () {
    return Math.round(this.staff.forecast).toLocaleString();
  },

  textClass: function () {
    return 'text-' + (this.staff.actual <= this.staff.forecast ? 'info' : 'danger');
  }
});


