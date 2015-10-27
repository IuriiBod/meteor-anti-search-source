Template.submitJobItem.helpers({
  isPrep: function() {
    var id = Session.get("jobType");
    var type = JobTypes.findOne(id);
    return !!(type && type.name == "Prep");
  },

  isRecurring: function() {
    var id = Session.get("jobType");
    var type = JobTypes.findOne(id);
    return !!(type && type.name == "Recurring");
  },

  isRecurringDaily: function() {
    var type = Session.get("frequency");
    return type == "Daily";
  },

  isRecurringEveryXWeeks: function() {
    var type = Session.get("frequency");
    return type === "Every X Weeks";
  },

  initChecklist: function () {
    var tmpl = Template.instance();
    Tracker.afterFlush(function () {
      tmpl.$(".checklist").sortable({
        cursor: "move",
        opacity: 0.8,
        delay: 50,
        update: function () {
          var items = [];
          var $list = $(this);
          $list.find(".list-group-item").each(function () {
            var $item = $(this);
            var text = $item.text().trim();
            items.push(text);
          });
          Session.set("checklist", items);
        }
      }).disableSelection();
    });
  },

  isSelectedJobType: function (jobType) {
    var selectedJobType = Session.get("jobType");
    return jobType === selectedJobType;
  }
});

Template.submitJobItem.events({
  'click #showIngredientsList': function(event,tmpl) {
    event.preventDefault();
    tmpl.$("#ingredientsListModal").modal("show");
  },

  'click #addNewIngredient': function(event) {
    event.preventDefault();
    $("#addIngredientModal").modal('show');
  },

  'submit form': function(event) {
    event.preventDefault();
    var local
    var name = $(event.target).find('[name=name]').val().trim();
    var typeId = $(event.target).find('[name=type]').val();
    var typeDoc = JobTypes.findOne(typeId);
    var type = null;
    if(typeDoc) {
      type = typeDoc.name;
    }
    var activeTime = $(event.target).find('[name=activeTime]').val().trim();
    var avgWagePerHour = $(event.target).find('[name=avgWagePerHour]').val().trim();

    if(!name) {
      return alert("Name should have a value");
    } 
    if(!activeTime) {
      return alert("Should have an active time for the job");
    }
    if(!type) {
      return alert("Should have an type for the job");
    }

    var info = {
      "name": name,
      "type": typeId,
      "activeTime": 0,
      "avgWagePerHour": 0
    };
    if(activeTime) {
      activeTime = parseInt(activeTime);
      if((activeTime == activeTime) && (activeTime > 0)) {
        info.activeTime = activeTime;
      } else {
        info.activeTime = 0;
      }
    }

    if(avgWagePerHour) {
      avgWagePerHour = parseFloat(avgWagePerHour);
      if((avgWagePerHour == avgWagePerHour) && (avgWagePerHour > 0)) {
        info.wagePerHour = Math.round(avgWagePerHour * 100)/100;
      } else {
        info.wagePerHour = 0;
      }
    }

    //if Prep
    if(type == "Prep") {
      var portions = $(event.target).find('[name=portions]').val().trim();
      var shelfLife = $(event.target).find('[name=shelfLife]').val().trim();
      var ing = $(event.target).find("[name=ing_qty]").get();
      var recipe = FlowComponents.child('jobItemEditorSubmit').getState('content');

      if(!portions) {
        info.portions = 0;
      } else {
        portions = parseFloat(portions);
        if((portions == portions) && (portions > 0)) {
          info.portions = portions;
        } else {
          info.portions = 0;
        }
      }

      if(!shelfLife) {
        info.shelfLife =  0;
      } else {
        shelfLife = parseFloat(shelfLife);
        if((shelfLife == shelfLife) && (shelfLife > 0)) {
          info.shelfLife = Math.round(shelfLife * 100)/100;
        } else {
          info.shelfLife = 0;
        }
      }
      
      if(recipe) {
        if($('.note-editable').text() === "Add recipe here" || $('.note-editable').text() === "") {
          info.recipe = null;
        } else {
          info.recipe = recipe;
        }
      }

      var ing_doc = [];
      var ingIds = [];
      ing.forEach(function(item) {
        var dataid = $(item).attr("data-id");
        if(dataid && (ingIds.indexOf(dataid) < 0)) {
          var quantity = $(item).val();
          var doc = {
            "_id": dataid,
            "quantity": 1
          };
          if(quantity) {
            quantity = parseFloat(quantity);
            if((quantity == quantity) && (quantity > 0)) {
              doc.quantity = quantity;
            }
          }
          ing_doc.push(doc);
          ingIds.push(dataid);
        }
      });

      if(ing_doc.length > 0) {
        info.ingredients = ing_doc;
      } 
    }

    //if Recurring
    else if(type == "Recurring") {

      var description = FlowComponents.child('jobItemEditorSubmit').getState('content');
      if(description) { 
        if($('.note-editable').text() === "Add description here" || $('.note-editable').text() === "") {
          info.description = "";
        } else {
          info.description = description;
        }
      } 
      //checklist
      info.checklist = Session.get("checklist");

      var frequency = $(event.target).find("[name=frequency]").val();
      if(!frequency) {
        return alert("Frequency should be defined");
      }
      info.frequency = frequency;

      if(frequency === "Every X Weeks") {
        var step = $(event.target).find("[name=step]").val();
        if(!step) {
          return alert("Step should be defined");
        }
        info.step = parseInt(step);
      }

      var repeatAt = $(event.target).find('[name=repeatAt]').val().trim();
      if(!repeatAt) {
        return alert("Repeat at should be defined");
      }
      info.repeatAt = moment(repeatAt, ["hh:mm A"]).format();

      var startsOn = $(event.target).find('[name=startsOn]').val();
      if(!startsOn) {
        return alert("Starts on should be defined");
      }
      info.startsOn = new Date(startsOn);
      info.endsOn = {
        "on": null
      };
      var endsOn = $(event.target).find('[type=radio]:checked').attr("data-doc");
      info.endsOn.on = endsOn;
      if(endsOn == "endsAfter") {
        var after = $(event.target).find("[name=occurrences]").val();
        if(!after) {
          return alert("No. of occurrences should be defined");
        }
        after = parseInt(after);
        if(after == after) {
          info.endsOn.after = after;
        } else {
          info.endsOn.after = 1;
        }
      } else if(endsOn == "endsOn") {
        var lastDate = $(event.target).find("[name=endsOn]").val();
        if(!lastDate) {
          return alert("Date to be ended on should be defined");
        }
        info.endsOn.lastDate = new Date(lastDate);
      }
      var section = $(event.target).find("[name=sections]").val();
      if(!section) {
        return alert("Section should be defined");
      }
      if(section) {
        info.section = section;
      }

      if(_.contains(["Every X Weeks", "Weekly"], frequency)) {
        var repeatDays = [];
        var repeatOn = $(event.target).find('[name=daysSelected]').get();
        repeatOn.forEach(function(doc) {
          if(doc.checked) {
            var value = $(doc).val();
            repeatDays.push(value);
          }
        });
        if(repeatDays.length <= 0) {
          return alert("Days to be repeated should be defined");
        } else {
          info.repeatOn = repeatDays;
        }
      }
    }
    FlowComponents.callAction('submit', info);
  },

  'change .changeType': function(event) {
    event.preventDefault();
    var type = $(event.target).val();
    Session.set("jobType", type);
    Session.set("frequency", "Daily");
    Session.set("localId", insertLocalJobItem());
  },

  'change .changeFrequency': function(event) {
    event.preventDefault();
    var frequency = $(event.target).val();
    Session.set("frequency", frequency);
  },

  'focus .timepicker': function(event) {
    event.preventDefault();
    $(".timepicker").datetimepicker({
      format: "LT"
    });
  },

  'focus .dateselecter': function(event) {
    event.preventDefault();
    $(".dateselecter").datepicker({
      todayBtn: "linked",
      keyboardNavigation: false,
      forceParse: false,
      calendarWeeks: true,
      autoclose: true,
      format: "yyyy-mm-dd"
    });
  },

  'keypress .addItemToChecklist': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var item = $(event.target).val().trim();
      if(item) {
        var listItems = Session.get("checklist");
        listItems.push(item);
        Session.set("checklist", listItems);
        var listItem = [
          "<li class='list-group-item'>",
          "<i class='fa fa-arrows-v text-muted small'></i> &nbsp; ",
          item.toString(),
          "<i class='fa fa-minus-circle m-l-lg right removelistItem'></i></li>"
        ].join('');
        $(".checklist").append(listItem);
        $(event.target).val("");
      }
    }
  },

  'click .removelistItem': function(event) {
    event.preventDefault();
    var removing = $(event.target).closest("li").text().trim();
    var listItems = Session.get("checklist");
    if(listItems.length > 0) {
      var index = listItems.indexOf(removing);
      if(index >= 0) {
        listItems.splice(index, 1);
      }
    }
    Session.set("checklist", listItems);
    $(event.target).closest("li").remove();
  }
});
