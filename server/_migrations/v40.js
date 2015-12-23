Migrations.add({
  version: 40,
  name: "Improve JobItems collection",
  up: function () {
    JobItems.find().forEach(function (jobItem) {

      if (!jobItem.status) {
        jobItem.status = 'active';
      }

      if (jobItem.startsOn) {
        var startsOn = new Date(jobItem.startsOn);
        jobItem.startsOn = startsOn;
      }

      if (jobItem.repeatAt) {
        var repeatAt = new Date(jobItem.repeatAt);
        jobItem.repeatAt = repeatAt;
      }

      if (jobItem.createdOn) {
        var createdOn = new Date(jobItem.createdOn);
        jobItem.createdOn = createdOn;
      }

      if (jobItem.editedOn) {
        var editedOn = new Date(jobItem.editedOn);
        jobItem.editedOn = editedOn;
      }

      if (jobItem.endsOn && jobItem.endsOn.lastDate) {
        var lastDate = new Date(jobItem.endsOn.lastDate);
        jobItem.endsOn.lastDate = lastDate;
      }

      if (jobItem.frequency) {
        var frequency = jobItem.frequency;
        switch (frequency) {
          case 'Daily':
            jobItem.frequency = 'daily';
            break;
          case 'Weekly':
            jobItem.frequency = 'weekly';
            break;
          case 'Every X Weeks':
            jobItem.frequency = 'everyXWeeks';
        }
      }

      if (jobItem.step) {
        jobItem.repeatEvery = jobItem.step;
        delete jobItem.step;
      }

      JobItems.update({_id: jobItem._id}, jobItem);
    });
  }
});
