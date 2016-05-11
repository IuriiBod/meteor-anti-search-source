// context title: String, panelId: String, color: String

Template.itemsPalette.onRendered(function () {
  let color = this.data.color;

  this.$('.panel-heading').css({
    'background-color': color,
    'border-color': color
  });

  this.$('.panel').css('border-color', color);
});