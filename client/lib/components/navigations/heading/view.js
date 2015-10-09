Template.pageHeading.events({
  'click .menuItemsRefresh': function () {
    var options = {limit: 30};
    var status = Router.current().params.status;
    options.filter = status == 'archived' ? [{"status": {$ne: "archived"}}] : [{"status": "archived"}];
    MenuItemsSearch.cleanHistory();
    MenuItemsSearch.search("", options);
  },
  'click [data-action="changeStatus"]': function (event) {
    event.preventDefault();
    IngredientsListSearch.cleanHistory();
    var selector = {
      limit: 30
    };
    var params = {};
    if (event.target.dataset.type == "archive") {
      selector.status = "archived";
      params = {
        type: "archive"
      };
    } else {
      selector.status = {$ne: "archived"};
    }
    IngredientsListSearch.search("", selector);
    Router.go(event.target.dataset.link, params);
  },

  'click [data-action="changeStatusJ"]': function (event) {
    event.preventDefault();
    JobItemsSearch.cleanHistory();
    var selector = {
      type: Session.get("type"),
      limit: 30
    };
    var params = {};
    if (event.target.dataset.type == "archive") {
      selector.status = "archived";
      params = {
        type: "archive"
      };
    } else {
      selector.status = {$ne: "archived"};
    }
    JobItemsSearch.search("", selector);
    Router.go(event.target.dataset.link, params);
  },

  'click .breadcrumbCategory': function (event) {
    event.preventDefault();
    var category = $(event.target).attr("data-category");
    if (category == "Jobs") {
      Router.go("jobItemsMaster");
    } else if (category == "Menus") {
      Router.go("menuItemsMaster", {"category": Session.get("category"), "status": Session.get("status")});
    } else if (category == "Settings") {
      Router.go("admin");
    } else if (category == "Stocktake List") {
      Router.go("stocktakeList");
    }
  },

  'click .breadcrumbSubCategory': function (event) {
    event.preventDefault();
    var category = $(event.target).attr("data-category");
    var id = $(event.target).attr("data-id");
    if (category == "Jobs") {
      Router.go("jobItemDetailed", {"_id": id});
    } else if (category == "Menus") {
      Router.go("menuItemDetail", {"_id": id});
    }
  },

  'click #submitMenuItem': function (event) {
    event.preventDefault();
    Router.go("submitMenuItem");
  },

  'click .subscribeMenuItemBtn': function (event) {
    event.preventDefault();
    var id = Session.get("thisMenuItem");
    Meteor.call("subscribe", id, function (err) {
      if (err) {
        HospoHero.error(err);
      }
    });
  },
  'click .unSubscribeMenuItemBtn': function (event) {
    event.preventDefault();
    var id = Session.get("thisMenuItem");
    Meteor.call("unSubscribe", id, function (err) {
      if (err) {
        HospoHero.error(err);
      }
    });
  },

  'click .copyMenuItemBtn': function (event, tpl) {
    event.preventDefault();
    tpl.$("#areaChooser").modal("show");
  },

  'click .copyJobItemBtn': function (event, tpl) {
    event.preventDefault();
    tpl.$("#areaChooser").modal("show");
  },

  'click .editMenuItemBtn': function (e) {
    e.preventDefault();
    Router.go("menuItemEdit", {"_id": $(e.target).attr("data-id")})
  },
  'click .deleteMenuItemBtn': function (e) {
    e.preventDefault();
    var result = confirm("Are you sure, you want to delete this menu ?");
    if (result) {
      var id = $(event.target).attr("data-id");
      var item = MenuItems.findOne(id);
      if (id) {
        Meteor.call("deleteMenuItem", id, function (err) {
          if (err) {
            HospoHero.error(err);
          } else {
            var options = {
              "type": "delete",
              "title": "Menu " + item.name + " has been deleted",
              "time": Date.now()
            };
            Meteor.call("sendNotifications", id, "menu", options, function (err) {
              if (err) {
                HospoHero.error(err);
              }
            });
            Router.go("menuItemsMaster", {"category": "all", "status": "all"});
          }
        });
      }
    }
  },

  'click .printMenuItemBtn': function (event) {
    event.preventDefault();
    print();
  },

  'click #submitJobItem': function (event) {
    event.preventDefault();
    Router.go("submitJobItem");
  },

  'click .subscribeJobsList': function (event) {
    event.preventDefault();
    Meteor.call("subscribe", "joblist", function (err) {
      if (err) {
        HospoHero.error(err);
      }
    });
  },

  'click .unSubscribeJobsList': function (event) {
    event.preventDefault();
    Meteor.call("unSubscribe", "joblist", function (err) {
      if (err) {
        HospoHero.error(err);
      }
    });
  },

  'click .todayRoster': function (event) {
    event.preventDefault();
    var date = moment().format("YYYY-MM-DD");
    Router.go("dailyRoster", {"date": date});
  },

  'click .prevDayRoster': function (event) {
    event.preventDefault();
    var date = Router.current().params.date;
    var yesterday = moment(date).subtract(1, "days").format("YYYY-MM-DD");
    Router.go("dailyRoster", {"date": yesterday});
  },

  'click .nextDayRoster': function (event) {
    event.preventDefault();
    var date = Router.current().params.date;
    var tomorrow = moment(date).add(1, "days").format("YYYY-MM-DD")
    Router.go("dailyRoster", {"date": tomorrow});
  },

  'click #publishRoster': function (event) {
    event.preventDefault();
    var weekNo = Session.get("thisWeek");
    var week = getDatesFromWeekNumber(parseInt(weekNo));
    var dates = [];
    week.forEach(function (day) {
      if (day && day.date) {
        dates.push(new Date(day.date).getTime())
      }
    });
    var shifts = Shifts.find({
      "shiftDate": {$in: dates},
      "published": false,
      "type": null,
      "relations.areaId": HospoHero.getCurrentAreaId()
    }).fetch();

    var tobePublished = [];
    var users = [];
    if (shifts.length > 0) {
      shifts.forEach(function (shift) {
        tobePublished.push(shift._id);
        if (users.indexOf(shift.assignedTo) < 0) {
          users.push(shift.assignedTo);
        }
      });
    }

    if (tobePublished.length > 0) {
      Meteor.call("publishRoster", weekNo, tobePublished, function (err) {
        if (err) {
          HospoHero.error(err);
        }
      });
      users.forEach(function (user) {
        var to = Meteor.users.findOne(user);
        if (to) {
          var weekStart = moment(dates[0]).format("dddd, Do MMMM YYYY");
          var title = "Weekly roster for the week starting from " + weekStart + " published";
          var text = "<br>";
          var open = "<br>";
          var shiftsPublished = Shifts.find({
            "assignedTo": user,
            "shiftDate": {$gte: dates[0], $lte: dates[6]}
          }).fetch();
          var openShifts = Shifts.find({
            "assignedTo": null,
            "shiftDate": {$gte: dates[0], $lte: dates[6]}
          }).fetch();
          if (shiftsPublished && openShifts) {
            if (shiftsPublished.length > 0) {
              shiftsPublished.forEach(function (shift) {
                var start = moment(shift.startTime).format("hh:mm A");
                var end = moment(shift.endTime).format("hh:mm A");
                text += "<a href='" + Meteor.absoluteUrl() + "roster/shift/" + shift._id + "'>" + moment(shift.shiftDate).format("ddd, Do MMMM") + " shift from " + start + " - " + end + "</a>.<br>";
              });
            }

            var info = {
              "title": title,
              "text": text,
              "startDate": weekStart,
              "week": weekNo
            };
            if (openShifts.length > 0) {
              openShifts.forEach(function (shift) {
                var start = moment(shift.startTime).format("hh:mm A");
                var end = moment(shift.endTime).format("hh:mm A");
                open += "<a href='" + Meteor.absoluteUrl() + "roster/shift/" + shift._id + "'>" + moment(shift.shiftDate).format("ddd, Do MMMM") + " shift from " + start + " - " + end + "</a>.<br>";
              });
              info.openShifts = open;
            }

            var to = {
              "_id": to._id,
              "email": to.emails[0].address,
              "name": to.username
            };

            Meteor.call("notifyRoster", to, info, function (err) {
              if (err) {
                HospoHero.error(err);
              }
            });
          }
        }
      });
    }
  },

  'click #startNewStocktake': function (event) {
    event.preventDefault();
    var date = moment().format("YYYY-MM-DD");
    var stocktake = StocktakeMain.findOne({
      "stocktakeDate": new Date(date).getTime(),
      "relations.areaId": HospoHero.getCurrentAreaId()
    });

    if (stocktake) {
      $("#newStocktakeModal").modal();
    } else {
      Meteor.call("createMainStocktake", date, function (err, id) {
        if (err) {
          HospoHero.error(err);
        } else {
          Router.go("stocktakeCounting", {"_id": id});
        }
      });
    }
  },

  'click .showHideButton': function (event) {
    if (Session.get("collapsed")) {
      Session.set("collapsed", false);
    } else {
      Session.set("collapsed", true);
    }
  },

  'click .archiveMenuItemBtn': function (e, tpl) {
    e.preventDefault();
    var i, id;
    if ($(e.target).hasClass('fa')) {
      i = $(e.target);
    } else {
      i = $(e.target).find('.fa');
    }
    id = i.parent().attr("data-id");

    Meteor.call("archiveMenuItem", id, function (err) {
      if (err) {
        HospoHero.error(err);
      } else {
        var menuItem = MenuItems.findOne(id);
        if(menuItem) {
          var text = "Menu item " + menuItem.name;
          if(menuItem.status == "active") {
            text += " restored";
          } else if(menuItem.status == "archived") {
            text += " archived";
          }
          return HospoHero.info(text);
        }
      }
    });
  },
  'click .archiveJobItem': function (e, tpl) {
    e.preventDefault();
    var id = tpl.$(e.target).attr("data-id");
    Meteor.call("archiveJobItem", id, function (err) {
      if (err) {
        HospoHero.error(err);
      } else {
        var jobItem = JobItems.findOne(id);
        if(jobItem) {
          var text = "Job item " + jobItem.name;
          if(jobItem.status == "active") {
            text += " restored";
          } else if(jobItem.status == "archived") {
            text += " archived";
          }
          return HospoHero.info(text);
        }
      }
    });
  },

  'click .deleteJobItem': function (event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var item = JobItems.findOne(id);

    var result = confirm("Are you sure you want to delete this job ?");
    if (result) {
      Meteor.call("deleteJobItem", id, function (err) {
        if (err) {
          HospoHero.error(err);
        } else {
          var options = {
            type: "delete",
            title: "Job " + item.name + " has been deleted",
            time: Date.now()
          };
          Meteor.call("sendNotifications", id, "job", options, function (err) {
            if (err) {
              HospoHero.error(err);
            }
          });
          Router.go("jobItemsMaster");
        }
      });
    }
  }
});

Template.pageHeading.rendered = function () {
  Session.set("collapsed", false);
  var checkedDate = Router.current().params.year;

  if (checkedDate) {
    var week = Router.current().params.week;
    Session.set("thisWeek", week);
    $(".day.active").siblings(".day").addClass("week");
  }

  $('.editMenuItemName').editable({
    type: "text",
    title: 'Edit menu name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    toggle: 'mouseenter',
    success: function (response, newValue) {
      var id = $(this).attr("data-id");
      if (id) {
        Meteor.call("editMenuItem", id, {name: newValue}, function (err) {
          if (err) {
            HospoHero.error(err);
          }
        });
      }
    }
  });
};

Template.pageHeading.helpers({
  'isArchive': function () {
    var archive = Router.current().params.status;
    return !!(archive && archive == "archived");
  },

  'isArchiveJob': function () {
    var archive = Router.current().params.type;
    return !!(archive && archive == "archive");
  }
});
