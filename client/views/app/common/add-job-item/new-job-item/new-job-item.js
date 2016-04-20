Template.newJobItem.onCreated(function () {
  var currentAreaId = HospoHero.getCurrentAreaId();
  this.subscribe('jobTypes');
  this.subscribe('sections', currentAreaId);
  this.subscribe('allSuppliers', currentAreaId);
  this.subscribe('ingredients', null, currentAreaId);
});

Template.newJobItem.helpers({
  getSettings: function () {
    var data = Template.currentData();
    data.inFlyout = true;
    return data;
  }
});