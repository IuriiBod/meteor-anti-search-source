Template.submitEditJobItem.onCreated(function () {

  this.selectedJobTypeId = new ReactiveVar(JobTypes.findOne()._id);
  this.selectedFrequency = new ReactiveVar('daily');
  this.repeatAt = new ReactiveVar(moment().hours(8).minutes(0).toDate());
  this.ingredients = [];
  this.checklistItems = new ReactiveVar([]);

  this.isPrep = function () {
    var selectedJobType = this.getSelectedJobType();
    return selectedJobType.name == 'Prep';
  };
  this.isRecurring = function () {
    var selectedJobType = this.getSelectedJobType();
    return selectedJobType.name == 'Recurring';
  };

  if (this.data.mode == 'edit') {
    this.jobItem = JobItems.findOne();
  }

  this.getSelectedJobType = function () {
    return JobTypes.findOne({_id: Template.instance().selectedJobTypeId.get()});
  };

  this.saveJobItem = function () {
    var jobItemObject = {};

    // job item fields
    // general fields
    this.assignGeneralFields(jobItemObject);

    // for recurring
    if (this.isRecurring()) {
      this.assignFieldsForRecurring(jobItemObject);
    }

    // for prep
    if (this.isPrep()) {
      this.assignFieldsForPrep(jobItemObject);
    }

    console.log(jobItemObject);
  };

  this.assignGeneralFields = function (jobItemObject) {
    jobItemObject.name = this.$('.name-input').val();
    jobItemObject.jobTypeId = this.selectedJobTypeId.get();
    jobItemObject.recipeOrDesc = this.$('.summernote').summernote('code');
    jobItemObject.activeTime = this.$('.active-time').val();
    jobItemObject.laboursWage = this.$('.avg-wage-per-hour').val();
  };

  this.assignFieldsForRecurring = function (jobItemObject) {
    jobItemObject.sectionId = this.$('.sections-select').val();
    jobItemObject.checklist; // ?
    jobItemObject.frequency = this.selectedFrequency.get();

    // if repeat every week
    if (this.selectedFrequency.get() == 'weekly' || 'everyXWeeks') {
      jobItemObject.repeatOnDays = this.getSelectedDays();

      // if repeat every X weeks
      if (this.selectedFrequency.get() == 'everyXWeeks') {
        jobItemObject.repeatEveryXWeeks = this.$('.repeat-every-weeks-input').val();
      }
    }
    jobItemObject.repeatAtTime = this.repeatAt.get();
    jobItemObject.startsOn = this.startsOnDatePicker.date().toDate();
    jobItemObject.endsOn = this.getEndsOnDate();
  };

  this.assignFieldsForPrep = function (jobItemObject) {
    jobItemObject.selectedIngredients = this.ingredients;
    jobItemObject.portions = this.$('.portions').val();
    jobItemObject.shelfLife = this.$('.shelf-life').val();
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
      var afterOccurrences = this.$('.occurrences-number-input').val();
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
});


Template.submitEditJobItem.onRendered(function () {
  var self = this;
  self.$(".checklist").sortable({
    cursor: "move",
    opacity: 0.8,
    delay: 50,
    update: function () {
      var items = [];
      // sorry for this. I not found in docs method for getting data from sortable
      var $list = $(this);
      $list.find(".list-group-item").each(function () {
        var $item = $(this);
        var text = $item.text().trim();
        items.push(text);
      });
      self.checklistItems.set(items);
    }
  }).disableSelection();

  self.$('.starts-on-date-picker').datetimepicker({
    format: 'YYYY-MM-DD'
  });
  self.startsOnDatePicker = self.$('.starts-on-date-picker').data('DateTimePicker');

  self.$('.ends-on-date-picker').datetimepicker({
    format: 'YYYY-MM-DD'
  });
  self.endsOnDatePicker = self.$('.ends-on-date-picker').data('DateTimePicker');
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
    return moment().format("YYYY-MM-DD");
  },
  endsOn: function () {
    return moment().add(7, 'days').format("YYYY-MM-DD");
  },
  week: function () {
    return ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
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
      event.preventDefault();
      var $input = $(event.target);
      var item = $input.val().trim();
      if (item) {
        tmpl.addCheckListItem(item);
      }
      $input.val('');
    }
  },

  'click .remove-check-list-item': function (e, tmpl) {
    var itemToRemove = $(e.target).parent().text().trim(); // and sorry for that ^_^
    tmpl.removeCheckListItem(itemToRemove);
  }
});