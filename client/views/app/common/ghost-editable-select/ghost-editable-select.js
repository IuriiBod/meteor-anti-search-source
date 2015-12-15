Template.ghostEditableSelect.onCreated(function () {
  // this.data.values is an array of objects {text: 'Text', value: '0'}
  this.set('values', this.data.values || []);
  this.set('isInline', this.data.isInline || true);

  this.selected = this.data.selected;
  this.onValueChanged = this.data.onValueChanged;
});

Template.ghostEditableSelect.helpers({
  isSelected: function (value) {
    return value === this.selected;
  },
  selectedText: function () {
    var self = this;
    var values = Template.instance().get('values');
    var text = '- select -';
    values.forEach(function (item) {
      if (self.selected === item.value) {
        text = item.text;
      }
    });
    return text;
  }
});

Template.ghostEditableSelect.events({
  'click .ghost-editable-select-trigger': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('isInline', false);
  },

  'change .ghost-editable-select': function (event, tmpl) {
    if (_.isFunction(tmpl.onValueChanged)) {
      tmpl.onValueChanged(event.target.value);
    }
    tmpl.set('isInline', true);
  }
});