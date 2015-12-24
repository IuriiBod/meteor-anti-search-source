//todo: !!! Don't use functions from this file. Use HospoHero functions instead.

getDaysOfMonth = function (date) {
  var month_startDate = moment(date).startOf('month').format("YYYY-MM-DD");
  var month_endDate = moment(date).endOf('month').format("YYYY-MM-DD");
  return {"start": month_startDate, "end": month_endDate};
};

//todo: DEPRECATED remove it in future (use it's analog in HospoHero.analyze)
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
            var ingItem = getIngredientItem(ing._id);
            if (ingItem) {
              jobItem.totalIngCost += parseFloat(ingItem.costPerPortionUsed) * parseFloat(ing.quantity);
            }
          });
        }
      }
      var totalCost = (jobItem.labourCost + jobItem.totalIngCost);
      if (totalCost > 0 && jobItem.portions > 0) {
        jobItem.prepCostPerPortion = HospoHero.misc.rounding(totalCost / jobItem.portions);
      } else {
        jobItem.prepCostPerPortion = 0;
      }
      jobItem.labourCost = HospoHero.misc.rounding(jobItem.labourCost);
      return jobItem;
    }
  }
};

//todo: DEPRECATED remove it in future (use it's analog in HospoHero.analyze)
getIngredientItem = function (id) {
  if (id) {
    var item = Ingredients.findOne(id);
    if (item) {
      if ((item.costPerPortion > 0) && (item.unitSize > 0)) {
        item.costPerPortionUsed = item.costPerPortion / item.unitSize;
        item.costPerPortionUsed = HospoHero.misc.rounding(item.costPerPortionUsed, 10000);
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

getMonthName = function (monthIndex, shortName) {
  var fullMonthName = ["January", "Fabruary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var shortMonthName = ["Jan", "Fab", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

  if (shortName) {
    return shortMonthName[monthIndex];
  } else {
    return fullMonthName[monthIndex];
  }
};