Template.applicationFormSettings.helpers({
  applicationId() {
    let applicationDefinition = ApplicationDefinitions.findOne();
    return applicationDefinition && applicationDefinition._id;
  }
});