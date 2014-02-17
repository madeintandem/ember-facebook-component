BasicAuthenticatable = Ember.Mixin.create({
  basicAuthorize: function(email, password, successCallback) {
    $.post("api/v1/authorizations", {
      email: email, password: password, source: "basic"
    }, successCallback);
  }
});