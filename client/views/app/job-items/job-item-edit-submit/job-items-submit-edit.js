Template.submitEditJobItem.onCreated(function () {
  this.jobItem = {};

  this.initReactiveVars = function () {
    this.jobItem = JobItems.findOne({_id: this.data.jobItemId}) || {};

    // Write data into reactive var
    this.selectedJobTypeId = new ReactiveVar(this.jobItem.type || JobTypes.findOne()._id);
    this.selectedFrequency = new ReactiveVar(this.jobItem.frequency || 'daily');
    this.repeatAt = new ReactiveVar(this.jobItem.repeatAt || moment().hours(8).minutes(0).toDate());
    this.checklistItems = new ReactiveVar(this.jobItem.checklist || []);
    this.ingredients = this.jobItem.ingredients || [];
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
    return JobTypes.findOne({_id: Template.instance().selectedJobTypeId.get()});
  };

  this.saveJobItem = function () {

    // job item fields
    // common fields
    this.assignCommonFields();

    // for recurring
    if (this.isRecurring()) {
      this.assignFieldsForRecurring();
    }

    // for prep
    if (this.isPrep()) {
      this.assignFieldsForPrep();
    }

    console.log(this.jobItem);
    Meteor.call('createJobItem', this.jobItem, HospoHero.handleMethodResult(function () {
      console.log('ok');
    }));
  };

  this.assignCommonFields = function () {
    this.jobItem.name = this.$('.name-input').val();
    this.jobItem.type = this.selectedJobTypeId.get();
    this.jobItem.activeTime = parseInt(this.$('.active-time').val());
    this.jobItem.wagePerHour = parseInt(this.$('.avg-wage-per-hour').val());
  };

  this.assignFieldsForRecurring = function () {
    this.jobItem.description = this.$('.summernote').summernote('code');
    this.jobItem.section = this.$('.sections-select').val();
    this.jobItem.checklist = this.checklistItems.get();
    this.jobItem.frequency = this.selectedFrequency.get();

    // if repeat every week
    if (this.selectedFrequency.get() == 'weekly' || 'everyXWeeks') {
      this.jobItem.repeatOn = this.getSelectedDays();

      // if repeat every X weeks
      if (this.selectedFrequency.get() == 'everyXWeeks') {
        this.jobItem.repeatEvery = parseInt(this.$('.repeat-every-weeks-input').val());
      }
    }
    this.jobItem.repeatAt = this.repeatAt.get();
    this.jobItem.startsOn = this.startsOnDatePicker.date().toDate();
    this.jobItem.endsOn = this.getEndsOnDate();
  };

  this.assignFieldsForPrep = function () {
    this.jobItem.recipe = this.$('.summernote').summernote('code');
    this.jobItem.ingredients = this.ingredients;
    this.jobItem.portions = parseInt(this.$('.portions').val());
    this.jobItem.shelfLife = parseInt(this.$('.shelf-life').val());
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
      var lastDate = this.endsOnDatePicker.date().toDate();
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
  console.log(this);
});


Template.submitEditJobItem.onRendered(function () {
  this.$('.checklist').sortable(this.sortableParams).disableSelection();

  this.$('.starts-on-date-picker').datetimepicker({
    format: 'YYYY-MM-DD'
  });
  this.startsOnDatePicker = this.$('.starts-on-date-picker').data('DateTimePicker');

  this.$('.ends-on-date-picker').datetimepicker({
    format: 'YYYY-MM-DD'
  });
  this.endsOnDatePicker = this.$('.ends-on-date-picker').data('DateTimePicker');
});


Template.submitEditJobItem.helpers({
  repeatAtComboEditableParams: function () {
    var thisTemplate = Template.instance()
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
    var startsOn = moment(Template.instance().jobItem.startsOn) || moment();
    return startsOn.format('YYYY-MM-DD');
  },
  endsOn: function () {
    var endsOn = moment(Template.instance().jobItem.endsOn.lastDate)
      || moment(Template.instance().jobItem.startsOn).add(1, 'days') || moment();
    return endsOn.format('YYYY-MM-DD');
  },
  week: function () {
    var days = ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

    var checkedDays = Template.instance().jobItem.repeatOn;

    return _.map(days, function (day) {
      debugger;
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

  jobItem: function () {
    return Template.instance().jobItem;
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