Router.route('/projects', {
  name: 'projectsList',
  template: 'projectsList'
});

Router.route('/create-project', {
  name: 'createProject',
  template: 'projectDetails',

  data() {
    return {
      createMode: true,
      id: null
    }
  }
});

Router.route('/project/:id', {
  name: 'projectDetails',
  template: 'projectDetails',

  data() {
    return {
      createMode: false,
      id: this.params.id
    }
  }
});