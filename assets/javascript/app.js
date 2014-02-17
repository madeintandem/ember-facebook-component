App = Ember.Application.create({
  rootElement: "root-element-id",

  registerAuthManager: function() {
    this.register("auth:manager", App.AuthManager, { singleton: true, instantiate: true });
    this.inject("controller", "authManager", "auth:manager");
    this.inject("route", "authManager", "auth:manager");
    this.inject("component:facebook-login", "authManager", "auth:manager");
  },

  ready: function() {
    this.registerAuthManager();
  }
});
App.deferReadiness();