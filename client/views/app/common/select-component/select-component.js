Template.selectComponent.onCreated(function () {
  var values;
  var passedValues = this.data.values;
  if (_.isArray(passedValues) && passedValues.length) {
    if (_.isObject(passedValues[0])) {
      values = passedValues;
    } else {
      values = _.map(passedValues, function (value) {
        return {
          value: value,
          text: value
        };
      });
    }
  } else {
    values = _.map(passedValues, function (value, text) {
      return {
        value: value,
        text: text
      };
    });
  }
  this.values = new ReactiveVar(values);
});

Template.selectComponent.helpers({
  name: function () {
    return this.name;
  },
  isSelected: function (id) {
    return id === Template.instance().data.selected;
  },
  values: function () {
    return Template.instance().values;
  }
});

Template.selectComponent.events({
  'change select': function (event, tmpl) {
    if (_.isFunction(tmpl.data.onValueChanged)) {
      tmpl.data.onValueChanged(event.target.value);
    }
  }
});