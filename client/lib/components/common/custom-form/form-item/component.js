var component = FlowComponents.define('customFormItem', function (props) {
  var item = props.item;
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

  this.parentErrorHandler = props.errorHandler;
});

component.state.componentToRender = function () {
  var item = this.get('item');
  var availableComponents = {
    'text': 'customFormInputText',
    'select': 'customFormInputSelect'
  };

  if(item && item.type) {
    var type = item.type === 'select' ? 'select' : 'text';
    return availableComponents[type];
  } else {
    return false;
  }
};

component.state.errorHandler = function () {
  var self = this;
  return function(errors) {
    self.set('errors', errors);

    var errorState = errors !== '';
    self.parentErrorHandler(self.get('item').name, errorState);
  }
};