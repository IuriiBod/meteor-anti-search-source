Template.relatedItemsWidget.onCreated(function () {
  this.subscribe('relatedItems', this.data.referenceId);
});


Template.relatedItemsWidget.helpers({
  relatedItems: function () {
    return RelatedItems.find({
      referenceId: this.referenceId
    });
  },

  relatedItemsOptions() {
    return {
      namespace: this.type,
      uiStateId: 'relatedItems',
      title: 'Related Items',
      buttons: [{
        url: '#',
        className: 'btn btn-primary btn-xs pull-left attach-item',
        text: 'Attach Item'
      }]
    };
  }
});


Template.relatedItemsWidget.events({
  'click .attach-item' (event, tmpl) {
    FlyoutManager.open('attachRelatedItem', {referenceId: tmpl.data.referenceId});
  }
});