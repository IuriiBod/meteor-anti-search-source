//context: values ([{text: String, value: any}]), onValueChanged (function), selected (any)

Template.ghostEditableSelect.onCreated(function () {
});


Template.ghostEditableSelect.onRendered(function () {
  var self = this;
  this.onBodyClick = function (event) {
    var eventTarget = $(event.target);
    var targetIsntChildOfSelect = !$.contains(self.$('.ghost-editable-select'), eventTarget);
    if (!eventTarget.hasClass('ghost-editable-select') && targetIsntChildOfSelect) {
      self.set('isInline', false);
    }
  };

  $("body").click(this.onBodyClick);
});


Template.ghostEditableSelect.helpers({
  optionAttrs: function () {
    var parentData = Template.parentData(1);
    var attributes = {
      value: this.value
    };

    if (parentData.selected === this.value) {
      attributes.selected = 'selected';
    }

    return attributes;
  },
  selectedText: function () {
    var self = this;
    return _.find(this.values, function (valueEntry) {
        return valueEntry.value === self.selected;
      }) || '- select -';
  }
});


Template.ghostEditableSelect.events({
  'click .ghost-editable-select-trigger': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('isInline', false);
  },

  'change .ghost-editable-select': function (event, tmpl) {
    if (_.isFunction(tmpl.data.onValueChanged)) {
      tmpl.data.onValueChanged(event.target.value);
    }
    tmpl.set('isInline', true);
  }
});


Template.ghostEditable.onDestroyed(function () {
  $('body').off('click', this.onBodyClick);
});