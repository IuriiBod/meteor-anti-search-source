//Formatted time with AM PM
UI.registerHelper('timeFormat', function(time) {
  return moment(time).format("HH:mm");
});

//Formatted time with AM PM
UI.registerHelper('time', function(time) {
  return moment(time).format("hh:mm");
});

//Formatted time with Ago 
UI.registerHelper('timeFromNow', function(time) {
  return moment(time).fromNow();
});

UI.registerHelper("DateTime", function(time) {
  return moment(time).format("DD/MM/YY hh:mm a");
});


//duration
UI.registerHelper('timeDuration', function(time) {
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
});

UI.registerHelper('timeDurationWithDecimal', function(time) {
  var hours = moment.duration(time).hours();
  var mins = moment.duration(time).minutes();
  var text = null;
  if(mins < 10) {
    text = hours + ".0" + mins;
  } else {
    text = hours + "." + mins;
  }
  return text;
});


UI.registerHelper('secondsToMinutes', function(secs) {
  var mins = secs/60;
  return mins;
});

UI.registerHelper("timeFormattedWithDate", function(time) {
  if(time) {
    return moment(time).format('MMMM Do YYYY, h:mm:ss a');
  } else {
    return "-"
  }
});

UI.registerHelper("dayFormat", function(date) {
  if(date) {
    return moment(date).format('ddd, Do MMMM');
  } else {
    return "-"
  }
});

UI.registerHelper("dateFormat", function(date) {
  if(date) {
    var dateFormatted = moment(date).format('YYYY-MM-DD');
    return dateFormatted;
  } else {
    return "-"
  }
});

UI.registerHelper("dateFormatDahsed", function(date) {
  if(date) {
    return moment(date).format('DD/MM/YYYY');
  } else {
    return "-";
  }
});

UI.registerHelper("username", function(id) {
  var user = Meteor.users.findOne(id);
  if(user) {
    return user.username;
  }
});

UI.registerHelper("jobTypeById", function(id) {
  if(id) {
    var type = JobTypes.findOne(id);
    if(type) {
      return type.name;
    } 
  } else {
    return "Not assigned";
  }
});

UI.registerHelper("sectionById", function(id) {
  if(id) {
    var section = Sections.findOne(id);
    if(section) {
      return section.name;
    }
  } else {
    return "Open";
  }
});

UI.registerHelper("stockById", function(id) {
  var stock = Ingredients.findOne(id);
  if(stock) {
    return stock.description;
  }
});

UI.registerHelper("roundCount", function(count) {
  if(count) {
    return Math.round(count * 100)/100;
  } else {
    return 0;
  }
});

UI.registerHelper("formatCurrency", function(amount) {
  if(amount && amount > 0) {
    amount = amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    amount = amount.substring(0, amount.lastIndexOf('.'));
    return amount;
  } else {
    return 0;
  }
});

UI.registerHelper("username", function(userId) {
  var user = Meteor.users.findOne(userId);
  if(user) {
    if(user.profile.firstname && user.profile.lastname) {
      return user.profile.firstname + " " + user.profile.lastname;
    } else {
      return user.username;
    }
  }
});

UI.registerHelper("profilePicture", function(userId) {
  var user = Meteor.users.findOne(userId);
  if(user) {
    if(user.profile.image) {
      return user.profile.image;
    } else if(user.services && user.services.google){
      return user.services.google.picture;
    } else {
      return "/images/user-image.jpeg";
    }
  }
});

UI.registerHelper("SupplierName", function(id) {
  if(id) {
    var supplier = Suppliers.findOne(id);
    if(supplier) {
      return supplier.name;
    } else {
      return "Not assigned";
    }
  } else {
    return "Not assigned";
  }
});