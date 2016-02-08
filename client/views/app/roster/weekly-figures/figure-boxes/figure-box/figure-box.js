Template.figureBox.onRendered(function () {
  this.$('[data-toggle="popover"]').popover({content: this.data.helpText});
});
