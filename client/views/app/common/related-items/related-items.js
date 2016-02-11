Template.relatedItems.onCreated(function () {
  this.subscribe('relatedItems', this.data.referenceId);
});


Template.relatedItems.helpers({
  relatedItems: function () {
    return RelatedItems.find({
      referenceId: this.referenceId
    });
  }
});


Template.relatedItems.events({
  'click .attach-item' (event, tmpl) {
    FlyoutManager.open('attachRelatedItem', {referenceId: tmpl.data.referenceId});
  }
});