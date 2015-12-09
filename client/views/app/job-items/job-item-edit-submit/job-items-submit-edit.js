Template.submitEditJobItem.onCreated(function () {
  console.log(this);

  this.selectedJobTypeId = new ReactiveVar(JobTypes.findOne()._id);
  this.selectedFrequency = new ReactiveVar('daily');

  if (this.data.mode == 'edit') {
    this.jobItem = JobItems.findOne();
  }

  this.getSelectedJobType = function () {
    return JobTypes.findOne({_id: Template.instance().selectedJobTypeId.get()});
  };
});

Template.submitEditJobItem.onRendered(function () {
});

Template.submitEditJobItem.helpers({
  repeatAtComboEditableParams: function () {
    return {
      firstTime: moment().hours(8).minutes(0).toDate(),
      onSubmit: function (time) {
        console.log(time);
      }
    }
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
})
;

Template.submitEditJobItem.events({
  'change .changeType': function (e, tmpl) {
    var selectedVal = $(e.target).val();
    tmpl.selectedJobTypeId.set(selectedVal);
  },
  'change .changeFrequency': function (e, tmpl) {
    var selectedVal = $(e.target).val();
    tmpl.selectedFrequency.set(selectedVal);
  }
});