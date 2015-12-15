Template.customFormInputText.onCreated(function () {
  this.set('item', this.data.item);

  this.checkLength = function (lengthType) {
    var self = this;
    return function (length) {
      var valueLength = self.get('value').length;
      return lengthType === 'min' ? valueLength >= length : valueLength <= length;
    }
  };

  this.checkRegExp = function () {
    var self = this;
    return function (regExp) {
      return regExp.test(self.get('value'));
    }
  };

  this.setError = function () {
    if (arguments && arguments.length) {
      var errorText = arguments[0];
      var self = this;

      if (errorText === '') {
        return self.data.errorHandler()('');
      } else {
        return function (errorParams) {
          if (errorParams && (_.isString(errorParams) || _.isNumber(errorParams))) {
            errorText += ": " + errorParams;
          }
          self.data.errorHandler()(errorText);
        }
      }

    } else {
      return false;
    }
  };
});

Template.customFormInputText.helpers({
  maxLength: function () {
    var validation = Template.instance().get('item').validation;
    return validation.maxLength ? {maxlength: validation.maxLength} : '';
  },
  required: function () {
    return Template.instance().get('item').required ? {required: "required"} : '';
  },
  disabled: function () {
    return Template.instance().get('item').disabled ? {disabled: "disabled"} : '';
  }
});

Template.customFormInputText.events({
  'blur input': function (event, tmpl) {
    var value = event.target.value;

    tmpl.set('value', value.trim());
    var validation = tmpl.get('item').validation;
    var errorsText = validation.errors || {};

    var validationFunctions = {
      minLength: tmpl.checkLength('min'),
      maxLength: tmpl.checkLength('max'),
      re: tmpl.checkRegExp()
    };

    var validationErrors = {
      minLength: tmpl.setError("Minimum required length"),
      maxLength: tmpl.setError("Maximum required length"),
      re: errorsText.re ? tmpl.setError(errorsText.re) : tmpl.setError("Invalid format")
    };

    for (var key in validationFunctions) {
      if (validation.hasOwnProperty(key)) {
        if (!validationFunctions[key](validation[key])) {
          validationErrors[key](validation[key]);
          return false;
        }
      }
    }

    tmpl.setError('');
  }
});