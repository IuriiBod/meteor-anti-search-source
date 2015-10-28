Namespace('HospoHero.template', {
  equal: function (a, b) {
    return (a === b);
  },

  profilePicture: function (userId) {
    userId = userId ? userId : Meteor.userId();
    var user = Meteor.users.findOne(userId);
    if (user) {
      if (user.profile && user.profile.image) {
        return user.profile.image;
      } else if (user.services && user.services.google && user.services.google.picture) {
        return user.services.google.picture;
      } else {
        return "/images/user-image.jpeg";
      }
    }
  },

  /**
   * @return {string}
   */
  supplierName: function (id) {
    if (id) {
      var supplier = Suppliers.findOne(id);
      return supplier ? supplier.name : "Not assigned";
    } else {
      return "Not assigned";
    }
  },

  roundCount: function (count) {
    return count ? Math.round(count * 100) / 100 : 0;
  },

  sectionById: function (id) {
    if (id) {
      var section = Sections.findOne(id);
      if (section) {
        return section.name;
      }
    } else {
      return "Open";
    }
  },

  jobTypeById: function (id) {
    if (id) {
      var type = JobTypes.findOne(id);
      if (type) {
        return type.name;
      }
    } else {
      return "Not assigned";
    }
  }
});

Object.keys(HospoHero.template).forEach(function (helper) {
  Template.registerHelper(helper, HospoHero.template[helper]);
});