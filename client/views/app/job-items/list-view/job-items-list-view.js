Template.jobItemsListMainView.onCreated(function (){
  this.selectedType = new ReactiveVar('Prep');
});

Template.jobItemsListMainView.events({
  'click .job-types-panel-item': function (e, tmpl) {
    var selectedType = $(e.currentTarget).attr('id');
    tmpl.selectedType.set(selectedType);
  }
});

Template.jobItemsListMainView.helpers({
  jobItemsListParams: function () {
    return {
      status: Template.instance().data.status,
      type: Template.instance().selectedType.get()
    };
  }
});