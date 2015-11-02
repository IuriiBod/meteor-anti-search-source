Template.salesFigureBox.onRendered(function () {
  this.$('[data-toggle="popover"]').popover({
    content: "The figure shows the actual sales result from the days in the past plus the forecast sales" +
    " for the rest of the week. So you can see if you're on track."
  });
});