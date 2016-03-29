Template.applicationsListItem.helpers({
  positions () {
    let positions = Positions.find({_id: {$in: this.positionIds}}).map(position => position.name);
    return positions || 'No selected positions';
  },
  
  status () {
    return this.appProgress.pop();
  }
});

Template.applicationsListItem.events({
  'click .application-list-item': function (event, tmpl) {
    Router.go('applicationDetails', {id: tmpl.data._id});
  }
});