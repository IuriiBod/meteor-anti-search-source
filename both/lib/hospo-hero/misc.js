Namespace('HospoHero.misc', {
  /**
   * Returns a string or an object with form field values
   *
   * @param {Object} event
   * @param {string|Array} fields - the name of needed field or array of field names
   * @param {string} fields[].name - name should be extracted from form
   * @param {string} [fields[].newName] - save specified value with `newName` key
   * @param {function} [fields[].transform] - should return transformed value based on argument
   * @param {boolean} trim - trims all values if true
   * @returns {string|Object}
   */
  getValuesFromEvent: function (event, fields, trim) {
    var getValue = function (field) {
      var value = event.target[_.isString(field) ? field : field.name].value;
      return _.isString(value) && trim ? value.trim() : value;
    };

    var values = {};

    var saveValue = function (field, value) {
      values[_.isString(field) ? field : field.newName || field.name] = value;
    };

    var processField = function (field) {
      var value = getValue(field);

      if (!_.isString(field)) {
        if (field.parse) {
          value = field.parse == 'int' ? parseInt(value) : parseFloat(value);
        }

        if (field.type && field.type == 'number') {
          value = isNaN(value) ? 0 : value;
        }

        if (_.isFunction(field.transform)) {
          value = field.transform(value, field);
        }
      }

      saveValue(field, value);
    };

    if (_.isArray(fields)) {
      fields.forEach(processField);
    } else {
      processField(fields);
    }

    return values;
  },

  getWeekRangeQueryByRouter: function (router) {
    var startDate = moment(router.params.date);
    var endDate = moment(startDate).add(7, 'days');
    return TimeRangeQueryBuilder.forInterval(startDate, endDate);
  },

  getWeekDateFromRoute: function (routeContext) {
    return {
      week: parseInt(routeContext.params.week),
      year: parseInt(routeContext.params.year)
    };
  },

  getSubscriptionDocument: function (type, itemId) {
    var subscription = Subscriptions.findOne({
      type: type,
      subscriber: Meteor.userId(),
      'relations.areaId': HospoHero.getCurrentAreaId()
    });

    if (subscription) {
      subscription.itemIds = itemId;
    } else {
      subscription = {
        type: type,
        itemIds: itemId,
        subscriber: Meteor.userId(),
        relations: HospoHero.getRelationsObject()
      };
    }
    return subscription;
  },
  getBackwardUrl: function () {
    var locationHref = location.href;
    var absoluteUrl = Meteor.isCordova ? 'http://meteor.local/' : Meteor.absoluteUrl();
    return locationHref.replace(absoluteUrl, "/");
  },

  getMenuItemsStatuses: function (includeArchived) {
    var statuses = ['ideas', 'active'];
    if (includeArchived) {
      statuses.push('archived');
    }
    return statuses;
  },

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
   * Rounding to a specified increment
   * @param {number} number - number for rounding
   * @param {number} [increment=100] - a decimal increment
   * @returns {number}
   */
  rounding: function (number, increment) {
    increment = increment || 100;
    return Math.round(number * increment) / increment;
  },

  simplifyWeatherDescription: (weather) => {
    let weatherRepresentation = '';
    switch (weather) {
      case weather == "Moderate or heavy snow in area with thunder":
      case weather == "Patchy light snow in area with thunder":
      case weather == "Blowing snow":
      case weather == "Heavy snow":
      case weather == "Moderate or heavy sleet showers":
      case weather == "Moderate or heavy snow showers":
      case weather == "Moderate or heavy showers of ice pellets":
      case weather == "Ice pellets":
      case weather == "Patchy moderate snow":
      case weather == "Light snow showers":
      case weather == "Light sleet showers":
      case weather == "Light showers of ice pellets":
      case weather == "Patchy light snow":
      case weather == "Moderate or heavy sleet":
      case weather == "Blizzard":
      case weather == "Moderate snow":
      case weather == "Patchy snow nearby":
      case weather == "Light snow":
      case weather == "Patchy sleet nearby":
      case weather == "Patchy heavy snow":
        weatherRepresentation = 'snow';
        break;

      case weather == "Heavy rain":
      case weather == "Heavy rain at times":
      case weather == "Moderate or heavy rain in area with thunder":
      case weather == "Patchy light rain in area with thunder":
      case weather == "Moderate or Heavy freezing rain":
      case weather == "Heavy freezing drizzle":
      case weather == "Torrential rain shower":
      case weather == "Moderate or heavy rain shower":
      case weather == "Thundery outbreaks in nearby":
      case weather == "Light rain shower":
      case weather == "Light freezing rain":
      case weather == "Moderate rain":
      case weather == "Light rain":
      case weather == "Freezing drizzle":
      case weather == "Light drizzle":
      case weather == "Patchy freezing drizzle nearby":
      case weather == "Light sleet":
      case weather == "Patchy light rain":
      case weather == "Patchy light drizzle":
      case weather == "Patchy rain nearby":
      case weather == "Moderate rain at times":
        weatherRepresentation = 'rain';
        break;

      case weather == "Fog":
      case weather == "Freezing fog":
      case weather == "Mist":
        weatherRepresentation = 'fog';
        break;

      case weather == "Overcast":
      case weather == "Cloudy":
      case weather == "Partly Cloudy":
        weatherRepresentation = 'clouds';
        break;

      case weather == "Clear":
      case weather == "Clear/Sunny":
      case weather == "Sunny":
        weatherRepresentation = 'sunny';
        break;
    }

    return weatherRepresentation;
  },

  /**
   * Returns query for task list only for passed user
   * @param userId - ID of needed user
   * @returns {Object}
   */
  getTasksQuery: function (userId) {
    var user = Meteor.users.findOne({_id: userId});
    var relations = user && user.relations;

    if (relations && relations.organizationId) {
      var allowedSharingTypes = ['area', 'location'];
      var allowedSharingIds = [userId, relations.organizationId];

      if (relations.locationIds) {
        allowedSharingIds = _.union(allowedSharingIds, relations.locationIds);
      }
      if (relations.areaIds) {
        allowedSharingIds = _.union(allowedSharingIds, relations.areaIds);
      }
      return {
        $or: [
          {
            'sharing.type': {
              $in: allowedSharingTypes
            }
          },
          {
            'sharing.id': {
              $in: allowedSharingIds
            }
          },
          {
            assignedTo: userId
          }
        ]
      };
    } else {
      return {};
    }
  }
});