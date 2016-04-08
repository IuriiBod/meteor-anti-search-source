//context: values(Array|Object), value(any), onValueChanged(Function), [valueAdapter({toOption: Function, toValue: Function})]
Template.selectComponent.onCreated(function () {
  this.options = new ReactiveVar([]);

  this.autorun(() => {
    let currentData = Template.currentData();
    let passedValues = currentData.values;
    this.options.set(convertValuesToSelectOptions(passedValues));
  });
});


Template.selectComponent.onRendered(function () {
  this.getSelectElement = () => this.$('select.form-control');

  this.onSelectChangeHandler = (event) => {
    if (_.isFunction(this.data.onValueChanged)) {
      let value = event.target.value;

      if (this.data.valueAdapter) {
        value = this.data.valueAdapter.toValue(value);
      }

      this.data.onValueChanged(value);
    }
  };

  //because of strange bug with 2 selects on single view - add event handler manually
  this.getSelectElement().on('change', this.onSelectChangeHandler);
});


Template.selectComponent.helpers({
  name: function () {
    return this.name;
  },

  isSelected: function (id) {
    let tmpl = Template.instance();
    let valueAdapter = tmpl.data.valueAdapter;
    let rawSelectedValue = tmpl.data.selected;

    let selectedValue = valueAdapter ? valueAdapter.toOption(rawSelectedValue) : rawSelectedValue;

    return id === selectedValue;
  },

  values: function () {
    return Template.instance().options.get();
  },

  showEmptyValue: function (values) {
    return this.emptyValue && (!values || values.length === 0);
  }
});


Template.selectComponent.onDestroyed(function () {
  this.getSelectElement().off('change', this.onSelectChangeHandler);
});

const convertValuesToSelectOptions = (passedValues) => {
  let values;
  if (_.isArray(passedValues) && passedValues.length > 0) {
    if (_.isObject(passedValues[0])) {
      // options are ready
      values = passedValues;
    } else {
      // convert array of strings
      values = _.map(passedValues, (value) => {
        return {
          value: value,
          text: value
        };
      });
    }
  } else {
    //convert object
    values = _.map(passedValues, (value, text) => {
      return {
        value: value,
        text: text
      };
    });
  }
  return values;
};