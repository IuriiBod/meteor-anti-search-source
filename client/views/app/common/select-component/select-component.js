Template.selectComponent.onCreated(function () {
  var values;
  var passedValues = this.data.values;
  if (_.isArray(passedValues) && passedValues.length) {
    if (typeof passedValues[0] == 'object') {
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
  this.set('values', values);
});

Template.selectComponent.helpers({
  name: function () {
    return this.name;
  },
  isSelected: function (id) {
    return id === Template.instance().data.selected;
  }
});