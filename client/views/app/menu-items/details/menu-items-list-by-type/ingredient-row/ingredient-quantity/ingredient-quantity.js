Template.ingredientRowQuantityEditable.onRendered(function () {
  this.$('.quantity').editable({
    mode: 'popup',
    type: 'text',
    autotext: 'auto',
    title: 'Enter quantity',
    display: false,
    success: this.data.onQuantityEditableSuccess
  });
});