# Prototype

Project base for MySQL, Express and Angular built on Node (aka: MEAN)


## Structure Overview

- `app.js`
- `config/`
  - `index.js`
  - `local.js`
  - `development.js`
  - `production.js`
  - `test.js`
- `libs/`
  - `helpers/`
  - `middleware/`
    - `isLoggedIn.js`
- `modules/`
  - `users`
    - `api.js`
    - `controller.js`
    - `middleware.js`
    - `model.js`
    - `routes.js`
- `public/`
  - `css/`
  - `js/`
- `views/`
  - `users/`
    - `login.html`
    - `myProfile.html`


## app.js

The entry point for the Express app. All setup logic should exist in here.


## config/

Loads common configs from `./config/index.js` and merges any environment
specific configs.

Example:

```javascript
var config = require('./config');
```

Configs set in `local.js` are ignored by Git and will override all other
configs. This is to set your own configs for database setup etc.


## libs/helpers/

Contains app-wide helper functions for use throught the app. These are typically
simple "utility" functions that are re-used in different areas.

Each helper should be a single file that exports a single function. The filename
should match the function.


## libs/middleware/

Contains app-wide middleware to be used by Express. Each middleware should be a
single file that exports a single function. The filename should match the
function name.

App-wide middleware can be autoloaded for every request by adding its name to
the `middleware` config array.

Example:

```javascript
middleware: ['abort', logHttpRequest', 'isLoggedIn']
```

The above would load the `logHttpRequest` and `isLoggedIn` middleware for every
request in the order specified.

If middleware logic is very specific to a module, put it in a modules
`middleware.js` file instead.


## modules/

Each piece of app functionality should be encapsulated in a module directory.
The module directory name should reflect what it is; `users/` for example.
Module names should be plural. Users vs User, People vs Person.

A module is made up of *one or more* of the following files:


## modules/[module]/api.js

Used for Express API based routes only. An API route should only ever return
JSON, and is not designed for loading views. All API routes begin with
`/api/[route-name]` automatically. So the `users/` module for example, would be
prepended with `/api/users` for all routes defined in `users/api.js`.

The router name for each loaded module is defined in the configs.


## modules/[module]/controller.js

Used for Express routes related to loading views. This would be the typical
type of routes used in an application. A user visits the url, some calls are
made to a model and the view for that route is loaded. The standard "C" in MVC
type stuff ;)

Each module loaded must define its initial route in the configs. This ensures
no route/name collisions between modules.


## modules/[module]/middleware.js

Used for module specific Express middleware. May contain multiple functions as
opposed to single function per file on app-wide middleware.


## modules/[module]/model.js

Contains model logic for the specific module. Simply a file of functions that
can be called to perform queries on the model.

Example:

```javascript
var users = require('./modules/users/model');
users.findAll(function(err, allUsers) {
  // ...
});
```

The `findAll` function would be defined in the `model.js` file.

If a module needs multiple models, then there should be a `models/` directory
that contains files named after the model. Model db table names should pre-prend
the module name

Example:

- `modules`
  - `accounts/`
    - `models/`
      - `users.js` table would be `accounts_users`
      - `history.js` table would be `accounts_history`

## public/

Contains public (static) content such as CSS, Javascript etc. The directory
structure should be self-explanitory ;)

## views/

A modules HTML views should exist here and not in the modules/ directory. HTML
views should be put inside a directory named after the module. File names
should match the route/function name.

Example:

```
views/accounts/dashboard.html
views/accounts/myAccount.html
```

## Conventions

### node file organization

- require npm packages first
- require local files second
- use module.exports at the top of the file (but below any requires)
