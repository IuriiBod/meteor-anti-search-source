getDaysOfMonth = function (date) {
  var month_startDate = moment(date).startOf('month').format("YYYY-MM-DD");
  var month_endDate = moment(date).endOf('month').format("YYYY-MM-DD");
  return {"start": month_startDate, "end": month_endDate};
};

getPrepItem = function (id) {
  if (id) {
    var jobItem = JobItems.findOne(id);
    if (jobItem) {
      jobItem.totalIngCost = 0;
      jobItem.prepCostPerPortion = 0;
      if (!jobItem.wagePerHour) {
        jobItem.labourCost = 0;
      } else {
        var activeTimeInMins = parseInt(jobItem.activeTime / 60);
        jobItem.labourCost = (parseFloat(jobItem.wagePerHour) / 60) * activeTimeInMins;
      }
      if (jobItem.ingredients) {
        if (jobItem.ingredients.length > 0) {
          jobItem.ingredients.forEach(function (ing) {
            Meteor.subscribe("ingredients", [id]);
            var ingItem = getIngredientItem(ing._id);
            if (ingItem) {
              jobItem.totalIngCost += parseFloat(ingItem.costPerPortionUsed) * parseFloat(ing.quantity);
            }
          });
        }
      }
      var totalCost = (jobItem.labourCost + jobItem.totalIngCost);
      if (totalCost > 0 && jobItem.portions > 0) {
        jobItem.prepCostPerPortion = Math.round((totalCost / jobItem.portions) * 100) / 100;
      } else {
        jobItem.prepCostPerPortion = 0;
      }
      jobItem.labourCost = Math.round(jobItem.labourCost * 100) / 100;
      return jobItem;
    }
  }
};

getIngredientItem = function (id) {
  if (id) {
    var item = Ingredients.findOne(id);
    if (item) {
      if ((item.costPerPortion > 0) && (item.unitSize > 0)) {
        item.costPerPortionUsed = item.costPerPortion / item.unitSize;
        item.costPerPortionUsed = Math.round(item.costPerPortionUsed * 100) / 100;
        if (item.costPerPortionUsed === 0) {
          item.costPerPortionUsed = 0.01;
        }
      } else {
        item.costPerPortion = 0;
        item.costPerPortionUsed = 0;
      }
      return item;
    }
  }
};

getFirstDateOfISOWeek = function (w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return ISOweekStart;
};

//returns dates and days of week in a array with given week number
getDatesFromWeekNumber = function (weekNo, year) {
  year = year ? year : new Date().getFullYear();
  var week = [];
  var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  daysOfWeek.forEach(function (day) {
    var doc = {};
    weekNo = parseInt(weekNo);
    if (day == "Sunday") {
      weekNo += 1;
    }
    doc["date"] = moment().day(day).year(year).week(weekNo).format("YYYY-MM-DD");
    doc["day"] = day;
    week.push(doc);
  });
  return week;
};

//returns dates and days of week in a array with given week number
getDatesFromWeekNumberWithYear = function (weekNo, date) {
  var year = moment(date).format("YYYY");
  var month = moment(date).format("MM");
  date = moment(date).format("DD");
  var week = [];
  var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  daysOfWeek.forEach(function (day) {
    var doc = {};
    if (day == "Sunday") {
      doc["date"] = moment(year + "-" + month + "-" + date).day(day).week(weekNo).add(7, "d").format("YYYY-MM-DD");
    } else {
      doc["date"] = moment(year + "-" + month + "-" + date).day(day).week(weekNo).format("YYYY-MM-DD");
    }
    doc["day"] = day;
    week.push(doc);
  });
  return week;
};

getWeekStartEnd = function (week, year) {
  if (year == undefined) {
    year = new Date().getFullYear();
  }
  var monday = getFirstDateOfISOWeek(week, year);
  var sunday = moment(monday).add(6, "d").endOf("d").toDate();

  return {
    "monday": monday,
    "sunday": sunday
  }
};

getMonthName = function (monthIndex, shortName) {
  var fullMonthName = ["January", "Fabruary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var shortMonthName = ["Jan", "Fab", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

  if (shortName) {
    return shortMonthName[monthIndex];
  } else {
    return fullMonthName[monthIndex];
  }
};

createNotificationText = function (id, oldItemData, newInfo) {
  var list = [];
  if (oldItemData) {
    for (var key in newInfo) {
      var title = "";
      var prefix = "";
      var postfix = "";

      if (key == "name") {
        title = "Name ";
      } else if (key == "type") {
        title = "Type";
      } else if (key == "portions") {
        title = "Portions ";
      } else if (key == "shelfLife") {
        title = "Shelf life ";
        postfix = " days";
      } else if (key == "wagePerHour") {
        title = "Hourly wage ";
        prefix = "$ ";
      } else if (key == "activeTime") {
        title = "Active time";
        postfix = " mins";
      } else if (key == "recipe") {
        title = "Recipe ";
      } else if (key == "description") {
        title = "Description ";
      } else if (key == "repeatAt") {
        title = "Repeats at ";
      } else if (key == "checklist") {
        title = "Checklist ";
      } else if (key == "endsOn") {
        title = "Ends on ";
      } else if (key == "ingredients") {
        title = "Ingredients ";
      } else if (key == "section") {
        title = "Section ";
      } else if (key == "frequency") {
        title = "Frequency ";
      } else if (key == "salesPrice") {
        prefix = "$ ";
        title = "Sales Price ";
      } else if (key == "category") {
        title = "Category ";
      } else if (key == "status") {
        title = "Status ";
      }

      if (key == 'recipe' || key == 'description' || key == "checklist") {
        var str;

        if (oldItemData.type == newInfo.type) {
          list.push("<br>" + title + " changed");
        }
      } else {
        str = title + " changed from '";
        if (key == "name" || key == "portions" ||
          key == "shelfLife" || key == "wagePerHour" ||
          key == "salesPrice" || key == 'status') {
          if (oldItemData.type == newInfo.type) {
            str += prefix + oldItemData[key] + postfix + "' to '" + prefix + newInfo[key] + postfix + "'";
            list.push("<br>" + str);
          }
        } else if (key == "activeTime") {
          if (oldItemData.type == newInfo.type) {
            str += prefix + parseInt(oldItemData[key]) / 60 + postfix + "' to '" + prefix + parseInt(newInfo[key]) + postfix + "'";
            list.push("<br>" + str);
          }
        } else if (key == "type") {
          if (oldItemData.type != newInfo.type) {
            str += oldItemData[key] + "' to '" + newInfo[key] + "'";
            list.push("<br>" + str);
          }
        } else if (key == "ingredients") {
          if (oldItemData.type == newInfo.type) {
            if (oldItemData.ingredients.length != newInfo.ingredients.length) {
              str = title + " changed";
              list.push("<br>" + str);
            }
          }
        } else if (key == "endsOn") {
          if (oldItemData.type == newInfo.type) {
            if (oldItemData.endsOn.on != newInfo.endsOn.on) {
              str = title + "changed from '" + oldItemData.endsOn.on + "' to '" + newInfo.endsOn.on + "'";
              list.push("<br>" + str);
            }
          }
        } else if (key == "category") {
          if (oldItemData.type == newInfo.type) {
            if (oldItemData.category != newInfo.category) {
              str = title + "changed from '" + Categories.findOne(oldItemData.category).name + "' to '" + Categories.findOne(newInfo.category).name + "'";
              list.push("<br>" + str);
            }
          }
        } else if (key == "section") {
          if (oldItemData.type == newInfo.type) {
            str = title + "changed from '" + Sections.findOne(oldItemData.section).name + "' to '" + Sections.findOne(newInfo.section).name + "'";
            list.push("<br>" + str);
          }
        }
      }
    }
  }
  return list;
};