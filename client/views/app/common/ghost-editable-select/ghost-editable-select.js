//context: values ([{text: String, value: any}]), onValueChanged (function), selected (any)
Template.ghostEditableSelect.onCreated(function () {
  this.set('isInline', true);
  this.set('selectedValue', this.data.selected);
});

Template.ghostEditableSelect.onRendered(function () {
  var self = this;
  this.onBodyClick = function (event) {
    var isClickOnEditable = $.contains(self.$('.ghost-editable-component')[0], event.target);
    if (!isClickOnEditable) {
      self.set('isInline', true);
    }
  };

  $("body").bind('click', this.onBodyClick);
});


Template.ghostEditableSelect.helpers({
  optionAttrs: function () {
    var selectedValue = Template.instance().get('selectedValue');
    var attributes = {
      value: this.value
    };

    if (this.value === selectedValue) {
      attributes.selected = 'selected';
    }

    return attributes;
  },

  selectedText: function () {
    var selectedValue = Template.instance().get('selectedValue');
    var selectedOption = _.find(this.values, function (valueEntry) {
      return valueEntry.value === selectedValue;
    });
    return selectedOption && selectedOption.text || '- select -';
  }
});


Template.ghostEditableSelect.events({
  'click .ghost-editable-select-trigger': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('isInline', false);
  },

  'change .ghost-editable-select': function (event, tmpl) {
    var selectedValue = event.target.value;
    tmpl.set('selectedValue', selectedValue);
    tmpl.set('isInline', true);

    if (_.isFunction(tmpl.data.onValueChanged)) {
      tmpl.data.onValueChanged(selectedValue);
    }
  }
});


Template.ghostEditableSelect.onDestroyed(function () {
  $('body').unbind('click', this.onBodyClick);
});