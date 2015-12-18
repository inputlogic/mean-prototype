# Prototype

Project base for MySQL, Express and Nunjucks built with Node (aka: MENN)

## Structure

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
    - `model.js`
    - `routes.js` 
- `public/`

### `app.js` 

The entry point for the Express app. All setup logic should exist in here.

### `config/` 

Loads common configs from index.js and any environment specific configs.

```
var config = require('./config');
```

### `middleware/`

Contains all middleware captured by Express. Each file should be a dedicated
function and the filename should be the same as the function name.

Middleware will be used for stuff like authenticating routes, custom 404 pages,
logging etc.

### `modules`

Each piece of app functionality should be encapsulated in a module directory. 
The module directory name should reflect what it is, `users/` for example. A 
module is made up of *one or more* of the following files:

#### `api.js`

Used for Express API based routes only. An API route should only ever return
JSON, and is not designed for loading views. All API routes should begin with 
`/api/`

#### `controller.js`

Used for Express routes related to loading views. This would be the typical
type of routes used in an application. A user visits the url, some calls are 
made to a model and the view for that route is loaded.

#### `model.js`

Contains model logic for this specific module. Simply a file of functions that
can be called to perform queries on the model.

If a module needs multiple models, then there should be a `models/` directory
that contains files named after the model. Model names and filenames should
pre-prend the module name

Example:

- `modules`
  - `account/`
    - models/`
      - `users.js` AccountUsers
      - `history.js` AccountHistory
