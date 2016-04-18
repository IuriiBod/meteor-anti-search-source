const isEmptyValue = (value) => value === null || _.isUndefined(value);

//context: values ([{text: String, value: any}]), onValueChanged (function), selected (any)
Template.ghostEditableSelect.onCreated(function () {
  this.isInline = new ReactiveVar(true);
  this.selectedValue = new ReactiveVar(this.data.selected);
});

Template.ghostEditableSelect.onRendered(function () {
  let tmpl = this;

  // select don't have blur event so we are using this dirty trick
  // to provide it
  this.onBodyClick = function (event) {
    if (tmpl.$('.ghost-editable-component').length) {
      let isClickOnEditable = $.contains(tmpl.$('.ghost-editable-component')[0], event.target);
      if (!isClickOnEditable) {
        tmpl.isInline.set(true);
      }
    }
  };

  $('body').bind('click', this.onBodyClick);
});


Template.ghostEditableSelect.helpers({
  optionAttrs: function () {
    var selectedValue = Template.instance().selectedValue.get();
    var attributes = {
      value: this.value
    };

    if (this.value === selectedValue) {
      attributes.selected = 'selected';
    }

    if (this.disabled || _.isArray(this.options)) {
      attributes.disabled = 'disabled';
    }

    return attributes;
  },

  selectedText: function () {
    let tmpl = Template.instance();
    let selectedValue = tmpl.selectedValue.get();

    let searchPredicate = valueEntry => valueEntry.value === selectedValue;
    let selectedOption = this.values.find(searchPredicate);

    //if not found -> search on second level
    if (_.isUndefined(selectedOption)) {
      this.values.some(valueGroup => {
        if (_.isArray(valueGroup.options)) {
          selectedOption = valueGroup.options.find(searchPredicate);
          if (!_.isUndefined(selectedOption)) {
            return true;
          }
        }
        return false;
      });
    }

    return selectedOption && selectedOption.text || tmpl.data.emptyValue || '- select -';
  },

  isInline: function () {
    return Template.instance().isInline.get();
  },

  emptyValueClass: function () {
    let tmpl = Template.instance();
    let selectedValue = tmpl.selectedValue.get();
    return isEmptyValue(selectedValue) ? 'empty-value' : '';
  }
});


Template.ghostEditableSelect.events({
  'click .ghost-editable-select-trigger': function (event, tmpl) {
    event.preventDefault();
    tmpl.isInline.set(false);
  },

  'change .ghost-editable-select': function (event, tmpl) {
    tmpl.isInline.set(true);

    let selectedValue = event.target.value;
    if (selectedValue === tmpl.data.emptyValue) {
      selectedValue = null;
    }
    tmpl.selectedValue.set(selectedValue);

    if (_.isFunction(tmpl.data.onValueChanged)) {
      tmpl.data.onValueChanged(selectedValue);
    }
  }
});


Template.ghostEditableSelect.onDestroyed(function () {
  $('body').unbind('click', this.onBodyClick);
});