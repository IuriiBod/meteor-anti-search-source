//context: figureBox (FigureBox)

Template.salesFigureBox.onRendered(function () {
  this.$('[data-toggle="popover"]').popover({
    content: "The figure shows the actual sales result from the days in the past plus the forecast sales" +
    " for the rest of the week. So you can see if you're on track."
  });
});

Template.salesFigureBox.helpers({
  weeklySale: function () {
    return parseInt(this.figureBox.getSales().actual).toLocaleString();
  },

  forecastedSale: function () {
    return this.figureBox.getSales().forecasted.toFixed(2);
  },

  percent: function () {
    return this.figureBox.getPercentDocs().sales;
  }
});
