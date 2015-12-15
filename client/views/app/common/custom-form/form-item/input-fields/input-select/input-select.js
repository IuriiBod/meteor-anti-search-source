Template.customFormInputSelect.onCreated(function () {
  var item = this.data.item;
  var defaultSelect = {
    value: null,
    options: []
  };
  item = _.defaults(item, defaultSelect);
  this.set('item', item);
});

Template.customFormInputSelect.helpers({
  isSelected: function (value) {
    return value === Template.instance().get('item').value;
  }
});