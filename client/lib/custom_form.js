CustomForm = function CustomForm(options) {
  this.name = options.name;
  this.id = options.id;
  this.fields = options.fields || {} ;
};

// ====== RENDERING FORM ======
CustomForm.prototype._getFormOpen = function() {
  return '<form name="' + this.name + '" id="' + this.id + '">';
};

// For field types Text, password, number, email...
CustomForm.prototype._getInputText = function(name, params) {
  var field = [];
  field.push('<input type="' + params.type + '" class="form-control"');
  field.push(' name="' + name + '" id="' + name + '"');

  if(params.placeholder) {
    field.push(' placeholder="' + params.placeholder + '"');
  }

  if(params.value) {
    field.push(' value="' + params.value + '"');
  }

  if(params.disabled) {
    field.push(' disabled="disabled"');
  }

  if(params.required) {
    field.push(' required');
  }
  field.push(' />');

  return field.join('');
};

CustomForm.prototype._getInputSelect = function(name, params) {
  var field = [];
  field.push('<select class="form-control" id="' + name + '" name="' + name + '">');
  if(params.options && params.options.length) {
    _.map(params.options, function(option, key) {
      field.push('<option value="' + option.value + '"');
      if(params.value !== undefined && (key === params.value || option.value === params.value)) {
        field.push(' selected="selected"');
      }
      field.push('>' + option.text + '</option>');
    });
  }
  field.push('</select>');

  return field.join('');
};

CustomForm.prototype._getInput = function(name, params) {
  params.type = params.type ? params.type : 'text';
  if(params.type == 'select') {
    return this._getInputSelect(name, params);
  } else {
    return this._getInputText(name, params);
  }
};

CustomForm.prototype._getSubmitButton = function(name, params) {
  var field = [];
  field.push('<button type="submit" class="btn ');
  if(!params.inline) {
    field.push('btn-block ');
  }
  field.push('btn-default" id="' + name + '" name="' + name + '">');
  field.push(params.value);
  field.push('</button>');
  return field.join('');
};

CustomForm.prototype._getFieldHTML = function(name, params) {
  if(params.type != 'submit') {
    var field = [];
    field.push('<div class="form-group');
    if(params.class) {
      field.push(' ' + params.class);
    }
    field.push('">');

    if(params.label) {
      field.push('<label class="control-label" for="' + name + '">');
      field.push(params.label);
      field.push('</label>');
    }

    field.push(this._getInput(name, params));

    field.push('<span class="help-block hide"></span>');
    field.push('</div>');
    return field.join('');
  } else {
    return this._getSubmitButton(name, params);
  }
};

CustomForm.prototype._getFields = function() {
  if(this.fields && Object.keys(this.fields).length) {
    var fieldsHTML = [];
    var self = this;
    _.map(this.fields, function(params, name) {
      fieldsHTML.push(self._getFieldHTML(name, params));
    });
    return fieldsHTML.join('');
  } else {
    return '';
  }
};

CustomForm.prototype.getForm = function() {
  var formOpen = this._getFormOpen();
  var fields = this._getFields();
  return formOpen + fields + '</form>';
};


// ====== FORM VALIDATION ======
CustomForm.prototype._validateField = function(template, name, params) {
  var value = template.$('[name="' + name + '"]').val().trim();

  if(params.validation) {
    var validation = params.validation;

    if(validation.required && value === '') {
      return {error: 'Required Field'};
    }

    if(validation.minLength && value.length < validation.minLength) {
      return {error: 'Minimum required length: ' + validation.minLength};
    }

    if(validation.maxLength && value.length > validation.maxLength) {
      return {error: 'Maximum required length: ' + validation.maxLength};
    }

    if(validation.re && (validation.re instanceof RegExp) && !validation.re.test(value)) {
      var error = 'Invalid ' + name;
      error = validation.reError ? validation.reError : error;
      return {error: error};
    }
  }

  return {value: value};
};

CustomForm.prototype._setError = function (template, name, error) {
  var field = template.$('[name="' + name + '"]');
  field.parent().removeClass('has-success').addClass('has-error');
  field.siblings('span').removeClass('hide').text(error);
};

CustomForm.prototype._setSuccess = function (template, name) {
  var field = template.$('[name="' + name + '"]');
  field.parent().removeClass('has-error').addClass('has-success');
  field.siblings('span').addClass('hide').text('');
};

CustomForm.prototype.validate = function(template) {
  var validationResults = {};
  var self = this;
  var hasErrors = false;

  _.map(this.fields, function(params, name) {
    if(params.type != 'submit') {
      var result = self._validateField(template, name, params);

      if (result.error) {
        self._setError(template, name, result.error);
        hasErrors = true;
      } else if (result.value) {
        self._setSuccess(template, name);
        validationResults[name] = result.value;
      }
    }
  });

  return hasErrors ? false : validationResults;
};

CustomForm.prototype.addField = function(name, options) {
  this.fields[name] = options;
};