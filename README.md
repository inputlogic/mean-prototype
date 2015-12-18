# Prototype

Project base for MySQL, Express and Nunjucks built with Node (aka: MENN)

## Structure Overview

- `app.js`
- `config/`
  - `index.js`
  - `development.js`
  - `production.js`
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

## Structure Detail

#### `app.js` 

The entry point for the Express app. All setup logic should exist in here.

#### `config/` 

Loads common configs from index.js and any environment specific configs.

Example: 

```javascript
var config = require('./config');
```

#### `middleware/`

Contains all app-wide middleware captured by Express. Each file should be a 
dedicated function and the filename should be the same as the function name, 
camel cased.

Middleware will be used for stuff like authenticating routes, custom 404 pages,
logging etc.

If middleware logic is very specific to a module, put it in a modules 
`middleware.js` file instead.

#### `modules/`

Each piece of app functionality should be encapsulated in a module directory. 
The module directory name should reflect what it is; `users/` for example. Module 
names should be plural. Users vs User, People vs Person.

A module is made up of *one or more* of the following files:

#### `<module>/api.js`

Used for Express API based routes only. An API route should only ever return
JSON, and is not designed for loading views. All API routes should begin with 
`/api/`

#### `<module>/controller.js`

Used for Express routes related to loading views. This would be the typical
type of routes used in an application. A user visits the url, some calls are 
made to a model and the view for that route is loaded.

#### `<module>/middleware.js`

Used for module specific Express middleware. May contain multiple functions.

#### `<module>/model.js`

Contains model logic for this specific module. Simply a file of functions that
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
that contains files named after the model. Model table names should pre-prend the 
module name

Example:

- `modules`
  - `accounts/`
    - models/`
      - `users.js` table would be `account_users`
      - `history.js` table would be `account_history`

#### `<module>/routes.js`

Contains the route mappings for a modules controllers and apis. The reason they
are defined here is for a single source of truth on how a URL is being handled.

Route names should try to prepend the module name where it makes sense. Obviously
this isn't always the case, such as a "home" page URL.

Controller route example: `/accounts/dashboard`

API route example: `POST /api/accounts/:id`

#### `public/`

Contains public (static) content such as CSS, Javascript etc. The directory
structure should be self-explanitory ;)

#### `views/`

A modules HTML views should exist here and not in the modules/ directory. HTML
views should be put inside a directory named after the module. File names
should be camel cased.

Example:

`views/accounts/dashboard.html`

`views/accounts/myAccount.html`