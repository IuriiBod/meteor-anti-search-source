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
          value = field.parse === 'int' ? parseInt(value) : parseFloat(value);
        }

        if (field.type && field.type === 'number') {
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
    var statuses = ['active', 'ideas'];
    if (includeArchived) {
      statuses.push('archived');
    }
    return statuses;
  },

  /**
   * Returns user's payrate for specified date
   * @param {Object} user user's document
   * @param {Date} date
   * @returns {*}
   */
  getUserPayRate: function (user, date) {
    if (user.profile && user.profile.payrates) {
      var wageDoc = user.profile.payrates;

      var currentWeekDay = moment(date).format('dddd').toLowerCase();

      var rate = wageDoc[currentWeekDay];
      if (!rate) {
        rate = wageDoc.weekdays;
      }
      return rate;
    } else {
      return 0;
    }
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
    ];
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

  /**
   * Returns query for task list only for passed user
   * @param userId - ID of needed user
   * @returns {Object}
   */
  getTasksQuery: function (userId) {
    var user = Meteor.users.findOne({_id: userId});
    var relations = user && user.relations;

    if (relations && relations.organizationIds) {
      var sharingObject = {
        'private': [userId],
        organization: relations.organizationIds
      };

      if (relations.locationIds) {
        sharingObject.location = relations.locationIds;
      }
      if (relations.areaIds) {
        sharingObject.area = relations.areaIds;
      }

      var or = _.map(sharingObject, function (value, key) {
        return {
          'sharing.type': key,
          'sharing.id': {
            $in: value
          }
        };
      });

      return {$or: or};
    } else {
      return {};
    }
  },

  escapeRegExpString: function (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  },

  /**
   * Returns different values of two passed arrays
   * @param {Array} array1
   * @param {Array} array2
   * @returns {Array}
   */
  arrayDifference: function (array1, array2) {
    if (array1.length > array2.length) {
      return _.difference(array1, array2);
    } else {
      return _.difference(array2, array1);
    }
  },

  hasUnavailability (unavailabilities, {startTime: shiftStart, endTime: shiftEnd}) {
    let isBetween = function (date, dateStart, dateEnd) {
      return date.valueOf() >= dateStart && date.valueOf() <= dateEnd;
    };

    let isBefore = function (date1, date2) {
      return date1.valueOf() < date2.valueOf();
    };

    let isAfter = function (date1, date2) {
      return date1.valueOf() > date2.valueOf();
    };

    if (unavailabilities && unavailabilities.length) {
      return unavailabilities.some((unavailability) => {
        let unavailabilityStart = unavailability.startDate;
        let unavailabilityEnd = unavailability.endDate;

        return isAfter(shiftStart, unavailabilityStart) && isBefore(shiftEnd, unavailabilityEnd) ||
          isBetween(shiftStart, unavailabilityStart, unavailabilityEnd) ||
          isBetween(shiftEnd, unavailabilityStart, unavailabilityEnd) ||
          isBefore(shiftStart, unavailabilityStart) && isAfter(shiftEnd, unavailabilityEnd);
      });
    } else {
      return false;
    }
  }
});