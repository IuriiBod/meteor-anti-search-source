Router.route('/projects', {
  name: 'projectsList',
  template: 'projectsList'
});

Router.route('/create-project', {
  name: 'createProject',
  template: 'projectDetails',

  data() {
    return {
      id: null
    }
  }
});

Router.route('/project/:id', {
  name: 'projectDetails',
  template: 'projectDetails',

  data() {
    return {
      id: this.params.id
    }
  }
});