var helpers = {
  //Formatted time with AM PM
  timeFormat: function(time) {
    return moment(time).format("HH:mm");
  },
  //Formatted time with AM PM
  time: function(time) {
    return moment(time).format("hh:mm");
  },
  //Formatted time with Ago
  timeFromNow: function(time) {
    return moment(time).fromNow();
  },
  DateTime: function(time) {
    return moment(time).format("DD/MM/YY hh:mm a");
  },
  //duration
  timeDuration: function(time) {
    var hours = moment.duration(time).hours();
    var mins = moment.duration(time).minutes();
    var text = null;
    if(hours > 0) {
      if(hours == 1) {
        text = hours + " hour ";
      } else {
        text = hours + " hours ";
      }
    }
    if(text) {
      if(mins == 1) {
        text += mins + " minute";
      } else {
        text += mins + " minutes";
      }
    } else {
      text = mins + " minute";
      if(mins == 1) {
        text = mins + " minute";
      } else {
        text = mins + " minutes";
      }
    }
    return text;
  },
  timeDurationWithDecimal: function(time) {
    var hours = moment.duration(time).hours();
    var mins = moment.duration(time).minutes();
    var text = null;
    if(mins < 10) {
      text = hours + ".0" + mins;
    } else {
      text = hours + "." + mins;
    }
    return text;
  },
  secondsToMinutes: function(secs) {
    return secs / 60;
  },
  timeFormattedWithDate: function(time) {
    if(time) {
      return moment(time).format('MMMM Do YYYY, h:mm:ss a');
    } else {
      return "-"
    }
  },
  dayFormat: function(date) {
    if(date) {
      return moment(date).format('ddd, Do MMMM');
    } else {
      return "-"
    }
  },
  dateFormat: function(date) {
    if(date) {
      return moment(date).format('YYYY-MM-DD');
    } else {
      return "-"
    }
  },
  username: function(id) {
    var user;
    if(!id) {
      user = Meteor.user();
    } else {
      user = Meteor.users.findOne(id);
    }
    if(user) {
      return user.username;
    }
  },
  jobTypeById: function(id) {
    var type = JobTypes.findOne(id);
    if(type) {
      return type.name;
    }
  },
  sectionById: function(id) {
    var section = Sections.findOne(id);
    if(section) {
      return section.name;
    }
  },
  stockById: function(id) {
    var stock = Ingredients.findOne(id);
    if(stock) {
      return stock.description;
    }
  },
  roundCount: function(count) {
    if(count) {
      return Math.round(count * 100)/100;
    } else {
      return 0;
    }
  },
  formatCurrency: function(amount) {
    if(amount && amount > 0) {
      amount = amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      amount = amount.substring(0, amount.lastIndexOf('.'));
      return amount;
    } else {
      return 0;
    }
  },
  /**
   * @return {string}
   */
  SupplierName: function(id) {
    if(id) {
      var supplier = Suppliers.findOne(id);
      if(supplier) {
        return supplier.name;
      }
    } else {
      return "Not assigned";
    }
  },

  isMe: function(id) {
    var userId = Meteor.userId();
    if(userId) {
      return (userId == id);
    }
  }
};

Object.keys(helpers).forEach(function (helperName) {
  Template.registerHelper(helperName,helpers[helperName]);
});