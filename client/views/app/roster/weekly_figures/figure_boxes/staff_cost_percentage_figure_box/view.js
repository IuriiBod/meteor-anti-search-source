Template.staffCostPercentageFigureBox.onRendered(function () {
  this.$('[data-toggle="popover"]').popover({
    content: "The figure shows the % of wages compared to sales. It take the actual results " +
    "from past days and forecasts from future days."
  });
});