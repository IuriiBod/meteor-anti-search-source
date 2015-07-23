Template.stocktakeCountingMainView.helpers({
  'new': function() {
    var view = Router.current().params._id;
    if(view == "new") {
      return true;
    } else {
      return false;
    }
  }
});