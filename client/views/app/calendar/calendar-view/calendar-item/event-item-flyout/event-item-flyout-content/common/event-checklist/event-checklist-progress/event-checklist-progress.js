Template.eventChecklistProgress.helpers({
  progress: function () {
    var progress = Math.round(this.doneTasks / this.allTasks * 100);
    var progressClass = progress < 50 ? 'danger' : progress >= 50 && progress < 100 ? 'warning' : 'default';
    return {
      percent: progress,
      class: progressClass
    };
  }
});