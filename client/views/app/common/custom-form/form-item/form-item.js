Template.customFormItem.onCreated(function () {
  var item = this.data.item;
  var defaultValues = {
    type: 'text',
    name: 'default',
    placeholder: '',
    value: '',
    disabled: false,
    required: false,
    validation: {}
  };
  item = _.defaults(item, defaultValues);
  this.set('item', item);

  this.set('errors', '');

  var tmpl = this;
  this.errorHandler = function () {
    return function (errors) {
      tmpl.set('errors', errors);

      var errorState = errors !== '';
      tmpl.data.errorHandler(tmpl.get('item').name, errorState);
    }
  };
});

Template.customFormItem.helpers({
  componentToRender: function () {
    var item = Template.instance().get('item');

    var availableComponents = {
      'text': 'customFormInputText',
      'select': 'customFormInputSelect'
    };

    if (item && item.type) {
      var type = item.type === 'select' ? 'select' : 'text';
      return availableComponents[type];
    } else {
      return false;
    }
  },
  templateData: function () {
    var tmpl = Template.instance();
    return {
      item: tmpl.get('item'),
      errorHandler: tmpl.errorHandler
    };
  }
});