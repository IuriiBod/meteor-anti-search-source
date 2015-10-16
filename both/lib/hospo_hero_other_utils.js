Namespace('HospoHero.otherUtils', {
  getCountries: function () {
    return [
      {
        text: "Australia",
        value: "AU"
      },
      {
        text: "Austria",
        value: "AT"
      },
      {
        text: "Canada",
        value: "CA"
      },
      {
        text: "Central African Republic",
        value: "CF"
      },
      {
        text: "China",
        value: "CN"
      },
      {
        text: "Egypt",
        value: "EG"
      },
      {
        text: "France",
        value: "FR"
      },
      {
        text: "Germany",
        value: "DE"
      },
      {
        text: "Greece",
        value: "GR"
      },
      {
        text: "India",
        value: "IN"
      },
      {
        text: "Italy",
        value: "IT"
      },
      {
        text: "Japan",
        value: "JP"
      },
      {
        text: "Netherlands",
        value: "NL"
      },
      {
        text: "New Zealand",
        value: "NZ"
      },
      {
        text: "Portugal",
        value: "PT"
      },
      {
        text: "Sweden",
        value: "SE"
      },
      {
        text: "Switzerland",
        value: "CH"
      },
      {
        text: "United Kingdom of Great Britain and Northern Ireland",
        value: "GB"
      },
      {
        text: "United States of America",
        value: "US"
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