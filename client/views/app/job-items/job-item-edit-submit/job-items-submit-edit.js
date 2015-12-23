Template.submitEditJobItem.onCreated(function () {
  this.initReactiveVars = function () {
    this.data.jobItem = this.data.jobItem || {};

    // Write data into reactive var
    this.selectedJobTypeId = new ReactiveVar(this.data.jobItem.type || JobTypes.findOne()._id);
    this.selectedFrequency = new ReactiveVar(this.data.jobItem.frequency || 'daily');
    this.repeatAt = new ReactiveVar(this.data.jobItem.repeatAt || moment().hours(8).minutes(0).toDate());
    this.checklistItems = new ReactiveVar(this.data.jobItem.checklist || []);
    this.ingredients = this.data.jobItem.ingredients || [];
  };

  this.isPrep = function () {
    var selectedJobType = this.getSelectedJobType();
    return selectedJobType.name == 'Prep';
  };
  this.isRecurring = function () {
    var selectedJobType = this.getSelectedJobType();
    return selectedJobType.name == 'Recurring';
  };

  this.getSelectedJobType = function () {
    return JobTypes.findOne({_id: this.selectedJobTypeId.get()});
  };

  this.saveJobItem = function () {
    var jobItem = {};

    // job item fields
    // common fields
    this.assignCommonFields(jobItem);

    // for recurring
    if (this.isRecurring()) {
      this.assignFieldsForRecurring(jobItem);
    }

    // for prep
    if (this.isPrep()) {
      this.assignFieldsForPrep(jobItem);
    }

    if (this.data.jobItem._id) {
      Meteor.call('editJobItem', jobItem, HospoHero.handleMethodResult(function (jobItemId) {
        Router.go('jobItemDetailed', {_id: jobItemId});
      }));
    } else {
      Meteor.call('createJobItem', jobItem, HospoHero.handleMethodResult(function (jobItemId) {
        Router.go('jobItemDetailed', {_id: jobItemId});
      }));
    }
  };

  this.assignCommonFields = function (jobItem) {
    var MINUTE = 60;

    jobItem.name = this.$('.name-input').val();
    jobItem.type = this.selectedJobTypeId.get();
    jobItem.activeTime = parseInt(this.$('.active-time').val()) * MINUTE;
    jobItem.wagePerHour = parseInt(this.$('.avg-wage-per-hour').val());

    if (this.data.jobItem._id) {
      this.assignOriginJobItemFields(jobItem);
    }
  };

  this.assignFieldsForRecurring = function (jobItem) {
    jobItem.description = this.$('.summernote').summernote('code');
    jobItem.section = this.$('.sections-select').val();
    jobItem.checklist = this.checklistItems.get();
    jobItem.frequency = this.selectedFrequency.get();

    // if repeat every week
    if (this.selectedFrequency.get() == 'weekly' || 'everyXWeeks') {
      jobItem.repeatOn = this.getSelectedDays();

      // if repeat every X weeks
      if (this.selectedFrequency.get() == 'everyXWeeks') {
        jobItem.repeatEvery = parseInt(this.$('.repeat-every-weeks-input').val()) || 0;
      }
    }
    jobItem.repeatAt = this.repeatAt.get();
    jobItem.startsOn = this.$('.starts-on-date-picker').data('DateTimePicker').date().toDate();
    jobItem.endsOn = this.getEndsOnDate();
  };

  this.assignFieldsForPrep = function (jobItem) {
    jobItem.recipe = this.$('.summernote').summernote('code');
    jobItem.ingredients = this.ingredients;
    jobItem.portions = parseInt(this.$('.portions').val());
    jobItem.shelfLife = parseInt(this.$('.shelf-life').val());
  };

  this.assignOriginJobItemFields = function (jobItem) {
    var originJobItem = this.data.jobItem;
    jobItem._id = originJobItem._id;
    jobItem.createdOn = originJobItem.createdOn;
    jobItem.createdBy = originJobItem.createdBy;
    jobItem.relations = originJobItem.relations;
    jobItem.status = originJobItem.status;
  };

  this.getSelectedDays = function () {
    var $selectedDays = this.$('.repeat-on-checkbox:checked');
    return _.map($selectedDays, function (item) {
      return $(item).val()
    });
  };
  this.getEndsOnDate = function () {
    var $checkedButton = this.$('.ends-on-radio:checked');
    var checkedButtonFor = $checkedButton.val();

    if (checkedButtonFor == 'never') {
      return {
        on: 'endsNever'
      }
    } else if (checkedButtonFor == 'occurrences') {
      var afterOccurrences = parseInt(this.$('.occurrences-number-input').val());
      return {
        after: afterOccurrences
      }

    } else if (checkedButtonFor == 'on-date') {
      var lastDate = this.$('.ends-on-date-picker').data('DateTimePicker').date().toDate();
      return {
        lastDate: lastDate
      }
    }
  };

  this.addCheckListItem = function (item) {
    var items = this.checklistItems.get();
    items.push(item);
    this.checklistItems.set(items);
  };
  this.removeCheckListItem = function (itemToRemove) {
    var items = this.checklistItems.get();
    items = _.reject(items, function (item) {
      return item == itemToRemove;
    });
    this.checklistItems.set(items);
  };


  var self = this;
  this.sortableParams = {
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

  this.initReactiveVars();
});

Template.submitEditJobItem.onRendered(function () {
  this.$('.checklist').sortable(this.sortableParams).disableSelection();
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
    return Template.instance().ingredients;
  },
  editIngredientsListOnChange: function () {
    var thisTemplate = Template.instance();
    return function (ingredientsList) {
      thisTemplate.ingredients = ingredientsList;
    };
  },

  isEditMode: function () {
    return Template.instance().data.mode == 'edit';
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
    var startsOn = moment(Template.instance().data.jobItem.startsOn) || moment();
    return startsOn.format('YYYY-MM-DD');
  },
  endsOn: function () {
    var endsOn = moment().add(1, 'days');
    if (Template.instance().data.jobItem.endsOn) {
      endsOn = moment(Template.instance().data.jobItem.endsOn.lastDate)
        || moment(Template.instance().data.jobItem.startsOn).add(1, 'days');
    }
    return endsOn.format('YYYY-MM-DD');
  },
  week: function () {
    var days = ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

    var checkedDays = Template.instance().data.jobItem ? Template.instance().data.jobItem.repeatOn : [];

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
    var activeTime = Template.instance().data.jobItem.activeTime;
    return activeTime ? activeTime / 60 : false;
  },

  jobItem: function () {
    return Template.instance().data.jobItem;
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
    e.preventDefault();
    tmpl.saveJobItem();
  },

  'keypress .add-item-to-checklist': function (e, tmpl) {
    if (event.keyCode == 10 || event.keyCode == 13) {
      var $input = $(event.target);
      var item = $input.val().trim();
      if (item) {
        tmpl.addCheckListItem(item);
      }
      $input.val('');
    }
  },
  'click .remove-check-list-item': function (e, tmpl) {
    var itemToRemove = this.toString();
    tmpl.removeCheckListItem(itemToRemove);
  }
});