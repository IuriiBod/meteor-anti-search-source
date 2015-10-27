Namespace('HospoHero.otherUtils', {
  getCountries: function () {
    return [
      {
        text: "Australia",
        value: "Australia"
      },
      {
        text: "Austria",
        value: "Austria"
      },
      {
        text: "Canada",
        value: "Canada"
      },
      {
        text: "Central African Republic",
        value: "Central African Republic"
      },
      {
        text: "China",
        value: "China"
      },
      {
        text: "Egypt",
        value: "Egypt"
      },
      {
        text: "France",
        value: "France"
      },
      {
        text: "Germany",
        value: "Germany"
      },
      {
        text: "Greece",
        value: "Greece"
      },
      {
        text: "India",
        value: "India"
      },
      {
        text: "Italy",
        value: "Italy"
      },
      {
        text: "Japan",
        value: "Japan"
      },
      {
        text: "Netherlands",
        value: "Netherlands"
      },
      {
        text: "New Zealand",
        value: "New Zealand"
      },
      {
        text: "Portugal",
        value: "Portugal"
      },
      {
        text: "Sweden",
        value: "Sweden"
      },
      {
        text: "Switzerland",
        value: "Switzerland"
      },
      {
        text: "United Kingdom of Great Britain and Northern Ireland",
        value: "United Kingdom"
      },
      {
        text: "United States of America",
        value: "United States of America"
      }
    ]
  },

  /**
   * Returns a string or an object with form field values
   * @param {Object} event
   * @param {String|Array} fields - the name of needed field or array of field names
   * @param {Boolean} trim
   * @returns {String|Object}
   */
  getValuesFromEvent: function(event, fields, trim) {
    var getValue = function(value, trim) {
      return trim ? value.trim() : value;
    };
    
    if(_.isString(fields)) {
      return getValue(event.target[fields].value, trim);
    } else if(_.isArray(fields)) {
      var values = {};
      fields.forEach(function(field) {
        if(_.isObject(field)) {
          var value = getValue(event.target[field.name].value, trim);
          if(field.parse) {
            value = field.parse == 'int' ? parseInt(value) : parseFloat(value);
          }

          if(field.type && field.type == 'number') {
            value = isNaN(value) ? 0 : value;
          }

          var name = field.newName || field.name;
          values[name] = value;
        } else {
          values[field] = getValue(event.target[field].value, trim);
        }

      });
      return values;
    }
  }
});