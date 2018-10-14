# mavis-nwjs-webpack
## Basic Setup
Orignially taken from this boilerplate: https://github.com/jarden-liu/node-webkit-webpack-starter (make sure to install the nwjs SDK). All other stuff included can be found in package.json.
## App Structure
````javascript
package.json
README.md
/app
  index.html
  index.js
  nwjs.json
  styles.less
  /assets
    /fonts
    /js
  /components
    /..
  /data
    appstate.db
    /[bridgename]
      classes.db
      construction.db
      metrics.db
      modules.db
      results.db
      /0
      /1
      /...
/build
  build.js
  config.js
  hotReload.js
  server.js
  utils.js
  webpack.config.js
  webpack.dev.config.js
  webpack.prod.config.js
/dist
/node_modules
````
## Structure
### Global
* /app/components/Data
* /app/components/Filter
* /app/components/Global
* /app/components/Header
* /app/components/LoadingScreen
* /app/components/MainMenu
* /app/components/Notifications
* /app/components/Pages
### Report
* /app/components/Report
### 3D Model
* /app/components/Model
### Visual Inspection
* /app/components/Inspection
### Settings
* /app/components/Settings