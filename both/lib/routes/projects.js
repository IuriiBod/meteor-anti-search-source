Router.route('/projects', {
  name: 'projectsList',
  template: 'projectsList',

  waitOn() {
    return Meteor.subscribe('projects', Meteor.userId())
  }
});

Router.route('/create-project', {
  name: 'createProject',
  template: 'projectDetails',

  data() {
    return {
      project: null
    }
  }
});

Router.route('/project/:id', {
  name: 'projectDetails',
  template: 'projectDetails',

  waitOn() {
    return Meteor.subscribe('project', this.params.id, Meteor.userId())
  },

  data() {
    return {
      project: Projects.findOne({_id: this.params.id})
    }
  }
});