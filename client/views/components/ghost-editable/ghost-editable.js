const isValueEmpty = (value) => value === null || _.isUndefined(value);

Template.ghostEditable.onCreated(function () {
  this.isEditableInput = new ReactiveVar(false);

  this.getInputValue = function () {
    return this.$('.ghost-editable-input').val();
  };

  this.submitValue = function () {
    let newValue = this.getInputValue();
    let oldValue = this.data.value;
    let valueChangeCb = this.data.onValueChanged;

    if (isValueEmpty(oldValue) || newValue.toString() !== oldValue.toString()) {
      if (_.isFunction(valueChangeCb)) {
        valueChangeCb(newValue);
      }
      this.isEditableInput.set(false);
    }
  };
});


Template.ghostEditable.helpers({
  isEditable() {
    return Template.instance().isEditableInput.get();
  },

  valueClass() {
    return isValueEmpty(this.value) && 'empty-value';
  },

  valueToDisplay() {
    return isValueEmpty(this.value) ? this.emptyValue || 'Empty' : this.value;
  }
});


Template.ghostEditable.events({
  'click .ge-save-value': function (event, tmpl) {
    event.preventDefault();
    tmpl.submitValue();
  },

  'click .ge-cancel-saving-value': function (event, tmpl) {
    tmpl.isEditableInput.set(false);
  },

  'keyup .ghost-editable-input': function (event, tmpl) {
    if (event.keyCode === 13) { //enter was pressed
      event.preventDefault();
      tmpl.submitValue();
    }
  },

  'click .ghost-editable-value': function (event, tmpl) {
    event.preventDefault();
    tmpl.isEditableInput.set(true);
  }
});

/**
 * Allows automatic focus change between ghost components in the list
 * @param {object} templateInstance current list item template instance
 * @param {string} relativeElementSelector root element of list item
 */
Template.ghostEditable.focusNextGhost = function (templateInstance, relativeElementSelector) {
  let nextListItemElement = templateInstance.$(relativeElementSelector).next();
  if (nextListItemElement.length > 0) {
    nextListItemElement.find('.ghost-editable-value').click();
  }
};