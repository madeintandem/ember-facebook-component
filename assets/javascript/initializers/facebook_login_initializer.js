Ember.Application.initializer({
  name: "facebook_login",

  initialize: function(container, application) {
    application.facebookAppId = "<your facebook app id here>";
  }
});
