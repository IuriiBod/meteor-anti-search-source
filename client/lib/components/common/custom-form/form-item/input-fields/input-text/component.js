var component = FlowComponents.define('customFormInputText', function (props) {
  this.errorHandler = props.errorHandler;
  this.set('item', props.item);
});

component.state.maxLength = function () {
  var validation = this.get('item').validation;
  return validation.maxLength ? {maxlength: validation.maxLength} : '';
};

component.state.required = function () {
  return this.get('item').required ? {required: "required"} : '';
};

component.state.disabled = function () {
  return this.get('item').disabled ? {disabled: "disabled"} : '';
};

component.action.checkValid = function (value) {
  this.set('value', value.trim());
  var validation = this.get('item').validation;
  var errorsText = validation.errors || {};

  var validationFunctions = {
    minLength: this.checkLength('min'),
    maxLength: this.checkLength('max'),
    re: this.checkRegExp()
  };

  var validationErrors = {
    minLength: this.setError("Minimum required length"),
    maxLength: this.setError("Maximum required length"),
    re: errorsText.re ? this.setError(errorsText.re) : this.setError("Invalid format")
  };

  for (var key in validationFunctions) {
    if (validation.hasOwnProperty(key)) {
      if (!validationFunctions[key](validation[key])) {
        validationErrors[key](validation[key]);
        return false;
      }
    }
  }

  this.setError('');

};

component.prototype.checkLength = function (lengthType) {
  var self = this;
  return function (length) {
    var valueLength = self.get('value').length;
    return lengthType === 'min' ? valueLength >= length : valueLength <= length;
  }
};

component.prototype.checkRegExp = function () {
  var self = this;
  return function (regExp) {
    return regExp.test(self.get('value'));
  }
};

component.prototype.setError = function () {
  if(arguments && arguments.length) {
    var errorText = arguments[0];
    var self = this;

    if(errorText === '') {
      return self.errorHandler('');
    } else {
      return function (errorParams) {
        if (errorParams && (_.isString(errorParams) || _.isNumber(errorParams))) {
          errorText += ": " + errorParams;
        }
        self.errorHandler(errorText);
      }
    }
  } else {
    return false;
  }
};