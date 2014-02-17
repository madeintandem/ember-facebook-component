ember-facebook-component
=====================

This repository provides the tools necessary to drop in an Ember component which handles client side authentication with the [Facebook SDK for Javascript](https://developers.facebook.com/docs/facebook-login/login-flow-for-web).  It then uses token based authentication along with Ember Data to communicate with a RESTful API.

# App.AuthManager

An example `AuthManager` class is provided here, but the `FacebookAuthenticatable` mixin is all that's required for interaction with the Facebook component.

# Facebook Authenticatable

To be used with the Facebook login component, your `AuthManager` implementation must include the `FacebookAuthenticatable` mixin.  The component itself depends on the following four methods: 

- `isAuthenticatedWithFacebook` - Checks for presence of Facebook authentication tokens on the `AuthManager`
- `facebookAuthenticate` - Sets auth tokens from the authentication response on the `AuthManager`
- `resetFacebook` - Clears auth tokens in `AuthManager`
- `facebookAuthorize` - Creates a session with the API

Action item: You will need to modify `facebookAuthorize` to mesh with your server solution:

```
facebookAuthorize: function(successCallback) {
    $.post("api/v1/session|authorization|etc", {
      facebook_id: this.get("facebookId"), facebook_token: this.get("facebookToken"), source: "facebook"
    }, successCallback);
  }
```

This should create a new session on the server and return a valid token response for all subsequent API calls moving forward: 

```
{
  authorization: {
    token: "valid session token",
    user: <valid user id>  }}
```

# Usage

There is currently no one file to include.  You will need to drop in the following pieces when setting up your Ember application.

1.  Register client side authentication manager on application readiness to make the `AuthManager` factory available in routes, controllers, and the component: 

	```
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
	```

2.  Implement `App.AuthManager` or your equivalency.  Example [here](https://github.com/devmynd/ember-facebook-component/blob/master/assets/javascript/config/auth_manager.js).  Make sure the factory (e.g. `App.AuthManager`) in step 1 when calling `register` matches your auth manager factory
3.  Register an initializer to set the `facebookAppId` on your app: 

	```
	Ember.Application.initializer({
	  name: "facebook_login",

	  initialize: function(container, application) {
	    application.facebookAppId = "<your facebook app id here>";
	  }
	});
	```
	
	OR
	
	```
	App.facebookAppId = <your facebook app id>;
	```

4.  Make sure the facebook login component template can be found via `Ember.TEMPLATES["components/facebook-login"]`.  Once available, usage in templates is as follows: 

	```
	{{facebook-login action="facebookSignIn"}}
	```

5.  The action specified in step 3, e.g. `facebookSignIn` needs a corresponding handler in an Ember Controller.  This handler should defer to the `FacebookAuthenticatable` mixin to authorize a user and pass in a callback to handle successful user sign in, e.g. transition to `index` route, etc.

```
	actions: {
		facebookSignIn: function() {
		  this.get("authManager").facebookAuthorize(this.handleSignInSuccess);
		}
	}
```

# API Validation

It's still recommended to check the validity of the user's facebook credentials prior to authorizing API access.  See [Facebook Access Token docs](https://developers.facebook.com/docs/facebook-login/access-tokens) for more information.

## Contributing

1. Fork it ( https://github.com/devmynd/ember-facebook-component/fork )
2. Create your feature branch (`git checkout -b new-feature`)
3. Commit your changes (`git commit -am 'Fixed X'`)
4. Push to the branch (`git push origin new-feature`)
5. Create new Pull Request