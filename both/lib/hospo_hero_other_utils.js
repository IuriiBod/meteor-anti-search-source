Namespace('HospoHero.otherUtils', {
  getCountries: function () {
    return {
      "Australia": "AU",
      "Austria": "AT",
      "Canada": "CA",
      "Central African Republic": "CF",
      "China": "CN",
      "Egypt": "EG",
      "France": "FR",
      "Germany": "DE",
      "Greece": "GR",
      "India": "IN",
      "Italy": "IT",
      "Japan": "JP",
      "Netherlands": "NL",
      "New Zealand": "NZ",
      "Portugal": "PT",
      "Sweden": "SE",
      "Switzerland": "CH",
      "United Kingdom of Great Britain and Northern Ireland": "GB",
      "United States of America": "US"
    }
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