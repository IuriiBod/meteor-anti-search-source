Template.submitEditJobItem.onCreated(function () {

  this.selectedJobTypeId = new ReactiveVar(JobTypes.findOne()._id);
  this.selectedFrequency = new ReactiveVar('daily');
  this.repeatAt = new ReactiveVar(moment().hours(8).minutes(0).toDate());
  this.ingredients = [];

  if (this.data.mode == 'edit') {
    this.jobItem = JobItems.findOne();
  }

  this.getSelectedJobType = function () {
    return JobTypes.findOne({_id: Template.instance().selectedJobTypeId.get()});
  };

  this.saveJobItem = function () {

    var jobTypeId = this.selectedJobTypeId.get();
    var frequency = this.selectedFrequency.get();
    var repeatAtTime = this.repeatAt.get();
    var selectedIngredients = this.ingredients;
    var text = this.$('.summernote').summernote('code');

    console.log(jobTypeId, '\n',
      frequency, '\n',
      repeatAtTime, '\n',
      selectedIngredients, '\n',
      text
    );
  };
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
    var selectedJobType = Template.instance().getSelectedJobType();
    return selectedJobType.name == 'Recurring';
  },
  isPrep: function () {
    var selectedJobType = Template.instance().getSelectedJobType();
    return selectedJobType.name == 'Prep';
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
  }
});