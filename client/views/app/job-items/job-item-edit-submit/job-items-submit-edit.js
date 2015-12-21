Template.submitEditJobItem.onCreated(function () {
  var self = this;

  var initReactiveVars = function () {
    self.data.jobItem = self.data.jobItem || {};

    // Write data into reactive var
    self.selectedJobTypeId = new ReactiveVar(self.data.jobItem.type || JobTypes.findOne()._id);
    self.selectedFrequency = new ReactiveVar(self.data.jobItem.frequency || 'daily');
    self.repeatAt = new ReactiveVar(self.data.jobItem.repeatAt || moment().hours(8).minutes(0).toDate());
    self.checklistItems = new ReactiveVar(self.data.jobItem.checklist || []);
  };

  initReactiveVars();
  this.addedIngredientsToThisJob = this.data.jobItem.ingredients || [];

  var getSelectedJobType = function () {
    return JobTypes.findOne({_id: self.selectedJobTypeId.get()});
  };
  this.isPrep = function () {
    var selectedJobType = getSelectedJobType();
    return selectedJobType.name == 'Prep';
  };
  this.isRecurring = function () {
    var selectedJobType = getSelectedJobType();
    return selectedJobType.name == 'Recurring';
  };
});

Template.submitEditJobItem.onRendered(function () {
  var sortableParams = {
    cursor: 'move',
    opacity: 0.8,
    delay: 50,
    update: function () {
      var items = [];
      // sorry for this. I couldn't found in docs method for getting data from sortable
      var $list = $(this);
      $list.find('.list-group-item').each(function () {
        var $item = $(this);
        var text = $item.text().trim();
        items.push(text);
      });
      self.checklistItems.set(items);
    }
  };
  this.$('.checklist').sortable(sortableParams).disableSelection();
});

Template.submitEditJobItem.helpers({
  repeatAtComboEditableParams: function () {
    var thisTemplate = Template.instance();
    return {
      firstTime: thisTemplate.repeatAt.get(),
      onSubmit: function (time) {
        thisTemplate.repeatAt.set(time);
      }
    }
  },

  checkListItems: function () {
    return Template.instance().checklistItems.get();
  },

  ingredients: function () {
    return Template.instance().addedIngredientsToThisJob;
  },
  editIngredientsListOnChange: function () {
    var thisTemplate = Template.instance();
    return function (ingredientsList) {
      thisTemplate.addedIngredientsToThisJob = ingredientsList;
    };
  },

  isEditMode: function () {
    return this.mode == 'edit';
  },
  isRecurring: function () {
    return Template.instance().isRecurring();
  },
  isPrep: function () {
    return Template.instance().isPrep();
  },

  jobTypes: function () {
    return JobTypes.find();
  },
  sections: function () {
    return Sections.find();
  },

  frequencies: function () {
    return [
      {
        value: 'daily',
        title: 'Daily'
      },
      {
        value: 'weekly',
        title: 'Weekly'
      },
      {
        value: 'everyXWeeks',
        title: 'Every X weeks'
      }
    ];
  },
  selectedFrequency: function () {
    return Template.instance().selectedFrequency.get();
  },

  startsOn: function () {
    var startsOn = moment(this.jobItem.startsOn) || moment();
    return startsOn.format('YYYY-MM-DD');
  },
  endsOn: function () {
    var endsOn = moment().add(1, 'days');
    if (this.jobItem.endsOn) {
      endsOn = moment(this.jobItem.endsOn.lastDate)
        || moment(this.jobItem.startsOn).add(1, 'days');
    }
    return endsOn.format('YYYY-MM-DD');
  },
  week: function () {
    var days = ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

    var checkedDays = this.jobItem ? this.jobItem.repeatOn : [];

    return _.map(days, function (day) {
      if (_.findWhere(checkedDays, day)) {
        return {
          day: day,
          checked: true
        }
      }
      return {
        day: day
      }
    });
  },

  activeTime: function () {
    var activeTime = this.jobItem.activeTime;
    return activeTime ? activeTime / 60 : false;
  }
});


Template.submitEditJobItem.events({
  'change .type-select': function (e, tmpl) {
    var selectedVal = $(e.target).val();
    tmpl.selectedJobTypeId.set(selectedVal);
  },
  'change .frequency-select': function (e, tmpl) {
    var selectedVal = $(e.target).val();
    tmpl.selectedFrequency.set(selectedVal);
  },

  'submit .job-item-submit-edit-form': function (e, tmpl) {

    var saveJobItem = function () {
      var assignCommonFields = function (jobItem) {
        var MINUTE = 60;

        jobItem.name = tmpl.$('.name-input').val();
        jobItem.type = tmpl.selectedJobTypeId.get();
        jobItem.activeTime = parseInt(tmpl.$('.active-time').val()) * MINUTE;
        jobItem.wagePerHour = parseInt(tmpl.$('.avg-wage-per-hour').val());

        if (tmpl.data.jobItem._id) {
          assignOriginJobItemFields(jobItem);
        }
      };

      var assignFieldsForRecurring = function (jobItem) {
        var getSelectedDays = function () {
          var $selectedDays = tmpl.$('.repeat-on-checkbox:checked');
          return _.map($selectedDays, function (item) {
            return $(item).val()
          });
        };
        var getEndsOnDate = function () {
          var $checkedButton = tmpl.$('.ends-on-radio:checked');
          var checkedButtonFor = $checkedButton.val();

          if (checkedButtonFor == 'never') {
            return {
              on: 'endsNever'
            }
          } else if (checkedButtonFor == 'occurrences') {
            var afterOccurrences = parseInt(tmpl.$('.occurrences-number-input').val());
            return {
              after: afterOccurrences
            }

          } else if (checkedButtonFor == 'on-date') {
            var lastDate = tmpl.$('.ends-on-date-picker').data('DateTimePicker').date().toDate();
            return {
              lastDate: lastDate
            }
          }
        };


        jobItem.description = tmpl.$('.summernote').summernote('code');
        jobItem.section = tmpl.$('.sections-select').val();
        jobItem.checklist = tmpl.checklistItems.get();
        jobItem.frequency = tmpl.selectedFrequency.get();

        // if repeat every week
        if (tmpl.selectedFrequency.get() == 'weekly' || 'everyXWeeks') {
          jobItem.repeatOn = getSelectedDays();

          // if repeat every X weeks
          if (tmpl.selectedFrequency.get() == 'everyXWeeks') {
            jobItem.repeatEvery = parseInt(tmpl.$('.repeat-every-weeks-input').val()) || 0;
          }
        }
        jobItem.repeatAt = tmpl.repeatAt.get();
        jobItem.startsOn = tmpl.$('.starts-on-date-picker').data('DateTimePicker').date().toDate();
        jobItem.endsOn = getEndsOnDate();
      };

      var assignFieldsForPrep = function (jobItem) {
        jobItem.recipe = tmpl.$('.summernote').summernote('code');
        jobItem.ingredients = tmpl.addedIngredientsToThisJob;
        jobItem.portions = parseInt(tmpl.$('.portions').val());
        jobItem.shelfLife = parseInt(tmpl.$('.shelf-life').val());
      };

      var assignOriginJobItemFields = function (jobItem) {
        var originJobItem = tmpl.data.jobItem;
        jobItem._id = originJobItem._id;
        jobItem.createdOn = originJobItem.createdOn;
        jobItem.createdBy = originJobItem.createdBy;
        jobItem.relations = originJobItem.relations;
        jobItem.status = originJobItem.status;
      };

      var jobItem = {};

      // job item fields
      // common fields
      assignCommonFields(jobItem);

      // for recurring
      if (tmpl.isRecurring()) {
        assignFieldsForRecurring(jobItem);
      }

      // for prep
      if (tmpl.isPrep()) {
        assignFieldsForPrep(jobItem);
      }

      if (tmpl.data.jobItem._id) {
        Meteor.call('editJobItem', jobItem, HospoHero.handleMethodResult(function (jobItemId) {
          Router.go('jobItemDetailed', {_id: jobItemId});
        }));
      } else {
        Meteor.call('createJobItem', jobItem, HospoHero.handleMethodResult(function (jobItemId) {
          Router.go('jobItemDetailed', {_id: jobItemId});
        }));
      }
    };

    e.preventDefault();
    saveJobItem();
  },

  'keypress .add-item-to-checklist': function (e, tmpl) {
    var addCheckListItem = function (item) {
      var items = tmpl.checklistItems.get();
      items.push(item);
      tmpl.checklistItems.set(items);
    };

    if (event.keyCode == 10 || event.keyCode == 13) {
      var $input = $(event.target);
      var item = $input.val().trim();
      if (item) {
        addCheckListItem(item);
      }
      $input.val('');
    }
  },
  'click .remove-check-list-item': function (e, tmpl) {
    var removeCheckListItem = function (itemToRemove) {
      var items = tmpl.checklistItems.get();
      items = _.reject(items, function (item) {
        return item == itemToRemove;
      });
      tmpl.checklistItems.set(items);
    };
    var itemToRemove = tmpl.toString();
    removeCheckListItem(itemToRemove);
  }
});