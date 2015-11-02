Template.editJobItem.helpers({
  ingredientsList: function() {
    Ingredients.find().fetch();
  },

  jobTypes: function() {
    return JobTypes.find().fetch();
  }
});

Template.editJobItem.events({
  'submit form': function(event) {
    event.preventDefault();
    var id = Session.get("thisJobItem");
    var name = $(event.target).find('[name=name]').val().trim();
    var type = $(event.target).find('[name=type]').val();
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

    var job = JobItems.findOne(id);
    Session.set("updatingJob", job);

    if(job) {
      var info = {};
      if(job.name != name) {
        info.name = name;
      }
      if(type) {
        info.type = type;
      }

      activeTime = parseInt(activeTime);
      if((job.activeTime/60) != activeTime) {
        if(activeTime == activeTime) {
          info.activeTime = activeTime;
        } else {
          info.activeTime = 0;
        }
      }

      avgWagePerHour = parseFloat(avgWagePerHour);
      avgWagePerHour =  Math.round(avgWagePerHour * 100)/100;
      if((job.wagePerHour) != avgWagePerHour) {
        if(avgWagePerHour == avgWagePerHour) {
          info.wagePerHour = avgWagePerHour;
        } else {
          info.wagePerHour = 0;
        }
      }

      //if Prep
      var type = JobTypes.findOne(type);
      if(type.name == "Prep") {
        var portions = $(event.target).find('[name=portions]').val().trim();
        var shelfLife = $(event.target).find('[name=shelfLife]').val().trim();
        var ing = $(event.target).find("[name=ing_qty]").get();
        var recipe = FlowComponents.child('jobItemEditorEdit').getState('content');

        portions = parseInt(portions);
        if(job.portions != portions) {
          if(portions == portions) {
            info.portions = portions;
          } else {
            info.portions = 0;
          }
        }

        shelfLife = parseFloat(shelfLife);
        if(job.shelfLife != shelfLife) {
          if(shelfLife == shelfLife) {
            info.shelfLife = shelfLife;
          } else {
            info.shelfLife = 0;
          }
        }

        if(job.recipe != recipe) {
          if($('.note-editable').text() === "Add recipe here" || $('.note-editable').text() === "") {
            info.recipe = "";
          } else {
            info.recipe = recipe;
          }
        }
        
        var ing_doc = [];
        ing.forEach(function(item) {
          var dataid = $(item).attr("data-id");
          var quantity = $(item).val();
          if(quantity) {
            quantity = parseFloat(quantity);
            if(quantity == quantity) {
              quantity = quantity;
            } else {
              quantity = 1;
            }
          } else {
            quantity = 1;
          }
          if(dataid) {
            if(job.ingredients.hasOwnProperty(dataid)) {
              if(job.ingredients[dataid] != quantity) {
                var doc = {
                  "_id": dataid,
                  "quantity": quantity
                };
                ing_doc.push(doc);
              }
            } else {
              var doc = {
                "_id": dataid,
                "quantity": quantity
              };
              ing_doc.push(doc);
            }
          }
        });

        if(ing_doc.length > 0) {
          info.ingredients = ing_doc;
        } 
      }

      //if Recurring
      else if(type.name == "Recurring") {
        var description = FlowComponents.child('jobItemEditorEdit').getState('content');
        if(job.description != description.trim()) {
          if($('.note-editable').text() === "Add description here" || $('.note-editable').text() === "") {
            info.description = "";
          } else {
            info.description = description;
          }
        }
        //checklist
        var listItems = Session.get("checklist");
        info.checklist = listItems;

        var frequency = $(event.target).find("[name=frequency]").val();
        if(!frequency) {
          return alert("Should have an frequency for the job");
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
          return alert("Should have an time to repeat");
        }
        if(job.repeatAt != repeatAt) {
          info.repeatAt = moment(repeatAt, ["hh:mm A"]).format();
        }
        var startsOn = $(event.target).find('[name=startsOn]').val();
        if(!startsOn) {
          return alert("Should have an date to start job");
        }
        startsOn = new Date(startsOn);
        if(moment(job.startsOn).format("YYYY-MM-DD") != moment(startsOn).format("YYYY-MM-DD")) {
          info.startsOn = startsOn;
        }

        var endsOn = $(event.target).find('[type=radio]:checked').attr("data-doc");
        if(endsOn) {
          if(job.endsOn) {
            if(job.endsOn.on != endsOn) {
              info.endsOn = {"on": endsOn};
            }
          } else {
            info.endsOn = {"on": endsOn};
          }

          if(endsOn == "endsAfter") {
            var after = $(event.target).find("[name=occurrences]").val();
            if(!after) {
              return alert("Should have No. of occurrences");
            }
            after = parseInt(after);
            if(after == after) {
              if(job.endsOn.after && job.endsOn.after != after) {
                info.endsOn = {"on": endsOn};
                info.endsOn['after'] = after;
              } else {
                info.endsOn = {'on': endsOn};
                info.endsOn['after'] = 10;
              }
            } else {
              info.endsOn.on = endsOn;
              info.endsOn['after'] = 1;
            }
          } else if(endsOn == "endsOn") {
            var lastDate = $(event.target).find("[name=endsOn]").val();
            if(!lastDate) {
              return alert("Should have a date to end");
            }
            if(job.endsOn && moment(job.endsOn.lastDate).format("YYYY-MM-DD") != lastDate) {
              info.endsOn.on = endsOn;
              info.endsOn['lastDate'] = new Date(lastDate);
            }
          }
        }
        var section = $(event.target).find("[name=sections]").val();
        if(!section) {
          return alert("Should have a section");
        }
        if(job.section != section) {
          info.section = section;
        }

        if(_.contains(["Every X Weeks", "Weekly"], frequency)) {
          var repeatDays = [];
          var repeatOn = $(event.target).find('[name=daysSelected]').get();
          repeatOn.forEach(function(doc) {
            if(doc.checked) {
              var value = $(doc).val();
              if(repeatDays.indexOf(value) < 0) {
                repeatDays.push(value);
              }             
            }
          });

          if(repeatDays.length == 0) {
            return alert("Should state the days to be repeated on");
          }
          info.repeatOn = repeatDays;
        }
      }
      FlowComponents.callAction('submit', id, info);
    }
  },

  'click #showIngredientsList': function(event, tmpl) {
    event.preventDefault();
    tmpl.$("#ingredientsListModal").modal("show");
  },

  'click #addNewIngredient': function(event) {
    event.preventDefault();
    tmpl.$("#addIngredientModal").modal('show');
  },

  'click .cancelEditJobItem': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Router.go("jobItemDetailed", {"_id": id});
  },

  'change .changeType': function(event) {
    event.preventDefault();
    var type = $(event.target).val();
    Session.set("jobType", type);
    Session.set("frequency", "Daily");
  },

  'change .changeFrequency': function(event) {
    event.preventDefault();
    var frequency = $(event.target).val();
    $(".repeatOn").prop('checked', false); 
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
    $(".dateselecter").datetimepicker({
      format: "YYYY-MM-DD"
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
    var item = $(event.target).closest("li").remove();
  }
});

Template.editJobItem.onRendered(function() {
  Session.set("jobType", null);
  Session.set("frequency", null);
  this.$(".checklist").sortable({
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
