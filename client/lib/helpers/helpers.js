var helpers = {
  //Formatted time with AM PM
  timeFormat: function (time) {
    return moment(time).format("HH:mm");
  },
  //Formatted time with AM PM
  time: function (time) {
    return moment(time).format("hh:mm");
  },
  //Formatted time with Ago
  timeFromNow: function (time) {
    return moment(time).fromNow();
  },
  DateTime: function (time) {
    return moment(time).format("DD/MM/YY hh:mm a");
  },
  //duration
  timeDuration: function (time) {
    var hours = moment.duration(time).hours();
    var mins = moment.duration(time).minutes();
    var text = null;
    if (hours > 0) {
      if (hours == 1) {
        text = hours + " hour ";
      } else {
        text = hours + " hours ";
      }
    }
    if (text) {
      if (mins == 1) {
        text += mins + " minute";
      } else {
        text += mins + " minutes";
      }
    } else {
      text = mins + " minute";
      if (mins == 1) {
        text = mins + " minute";
      } else {
        text = mins + " minutes";
      }
    }
    return text;
  },
  timeDurationWithDecimal: function (time) {
    var hours = moment.duration(time).hours();
    var mins = moment.duration(time).minutes();
    var text = null;
    if (mins < 10) {
      text = hours + ".0" + mins;
    } else {
      text = hours + "." + mins;
    }
    return text;
  },
  secondsToMinutes: function (secs) {
    return secs / 60;
  },
  timeFormattedWithDate: function (time) {
    if (time) {
      return moment(time).format('MMMM Do YYYY, h:mm:ss a');
    } else {
      return "-"
    }
  },
  dayFormat: function (date) {
    if (date) {
      return moment(date).format('ddd, Do MMMM');
    } else {
      return "-"
    }
  },
  dateFormat: function (date) {
    if (date) {
      return moment(date).format('YYYY-MM-DD');
    } else {
      return "-"
    }
  },
  username: function (userId) {
    var user = Meteor.users.findOne(userId);
    if(user) {
      if(user.profile.firstname && user.profile.lastname) {
        return user.profile.firstname + " " + user.profile.lastname;
      } else {
        return user.username;
      }
    }
  },
  jobTypeById: function (id) {
    if(id) {
      var type = JobTypes.findOne(id);
      if(type) {
        return type.name;
      }
    } else {
      return "Not assigned";
    }
  },
  sectionById: function (id) {
    if(id) {
      var section = Sections.findOne(id);
      if(section) {
        return section.name;
      }
    } else {
      return "Open";
    }
  },
  roundCount: function (count) {
    if (count) {
      return Math.round(count * 100) / 100;
    } else {
      return 0;
    }
  },
  /**
   * @return {string}
   */
  supplierName: function (id) {
    if (id) {
      var supplier = Suppliers.findOne(id);
      return supplier ? supplier.name : "Not assigned";
    } else {
      return "Not assigned";
    }
  },

  equal: function (a, b) {
    return (a === b);
  },

  // TODO: Merge these two methods and replace it in the project
  getProfileImage: function (userId) {
    userId = userId ? userId : Meteor.userId();
    var user = Meteor.users.findOne(userId);

    var image = "/images/user-image.jpeg";

    if (user && user.services && user.services.google) {
      image = user.services.google.picture;
    }
    return image;
  },

  profilePicture: function(userId) {
    var user = Meteor.users.findOne(userId);
    if (user) {
      if (user.profile.image) {
        return user.profile.image;
      } else if (user.services && user.services.google) {
        return user.services.google.picture;
      } else {
        return "/images/user-image.jpeg";
      }
    }
  },

  formatCurrency: function (amount) {
    if (amount && amount > 0) {
      amount = amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      amount = amount.substring(0, amount.lastIndexOf('.'));
      return amount;
    } else {
      return 0;
    }
  },

  stockById: function (id) {
    var stock = Ingredients.findOne(id);
    return stock ? stock.description : false;
  }
};

Object.keys(helpers).forEach(function (helperName) {
  Template.registerHelper(helperName, helpers[helperName]);
});