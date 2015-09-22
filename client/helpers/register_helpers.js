Template.registerHelper('isInOrganization', HospoHero.isInOrganization);
Template.registerHelper('isOrganizationOwner', HospoHero.isOrganizationOwner);
Template.registerHelper('getOrganization', HospoHero.getOrganization);
Template.registerHelper('isAdmin', HospoHero.isAdmin);
Template.registerHelper('isManager', HospoHero.isManager);
Template.registerHelper('isWorker', HospoHero.isWorker);
Template.registerHelper('getCurrentArea', HospoHero.getCurrentArea);

Template.registerHelper('canInvite', HospoHero.perms.canInvite);