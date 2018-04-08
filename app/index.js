// include css
require('./styles.less');

// include index
require('./index.html');

// include global app components
const Mavis = require('./components/Global/Global');
Mavis.LoadingScreen = require('./components/LoadingScreen/LoadingScreen');
Mavis.Data = require('./components/Data/Data');
Mavis.Header = require('./components/Header/Header');
Mavis.MainMenu = require('./components/MainMenu/MainMenu');
Mavis.Notifications = require('./components/Notifications/Notifications');
Mavis.Pages = require('./components/Pages/Pages');
Mavis.Filter = require('./components/Filter/Filter');

// include app pages
Mavis.Report = require('./components/Report/Report');
Mavis.Inspection = require('./components/Inspection/Inspection');
Mavis.Model = require('./components/Model/3DModel');
Mavis.Settings = require('./components/Settings/Settings');

// app init
Mavis.LoadingScreen.init()
  .then(Mavis.Global.init())
  .then(Mavis.Data.init())
  .then(Mavis.Header.init())
  .then(Mavis.MainMenu.init())
  .then(Mavis.Pages.loadPage('model'));