//context: MenuItem
Template.menuItemDetailedMainView.helpers({
  jobItems() {
    return this.jobItems.map((item) => {
      let jobItem = JobItems.findOne({_id: item._id});
      jobItem.quantity = item.quantity;
      return jobItem;
    });
  }
});