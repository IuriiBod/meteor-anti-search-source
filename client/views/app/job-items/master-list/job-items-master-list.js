Template.jobItemsList.onCreated(function () {
  this.getTypeId = function () {
    return JobTypes.findOne({name: this.data.type})._id;
  }
});

Template.jobItemsList.onRendered(function () {
});

Template.jobItemsList.helpers({
  jobItems: function () {
    var status = Template.instance().data.status || {$ne: 'archived'};
    var query = {
      status: status,
      type: Template.instance().getTypeId()
    };
    return JobItems.find(query);
  },
  type: function () {
    return Template.instance().getTypeId();
  },
  isRecurring: function () {
    return Template.instance().data.type == 'Recurring';
  }
});

Template.jobItemsList.events({});