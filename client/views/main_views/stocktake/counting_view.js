Template.stocktakeCountingMainView.helpers({
  'new': function() {
    var view = Router.current().params.date;
    if(view == "new") {
      return true;
    } else {
      return false;
    }
  }
});