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

  getValuesFromEvent: function(event, fields, trim) {
    var getValue = function(value, trim) {
      return trim ? value.trim() : value;
    };
    
    if(typeof fields == 'string') {
      return getValue(event.target[fields].value, trim);
    } else if(Array.isArray(fields)) {
      var values = {};
      fields.forEach(function(field) {
        values[field] = getValue(event.target[field].value, trim);
      });
      return values;
    }
  }
});