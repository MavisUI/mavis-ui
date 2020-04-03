import React from 'react';
import ReactDOM from 'react-dom';
import App from './react/App';
import './styles.less';
import './index.html';

ReactDOM.render(<App />, document.getElementById('app'));
/**
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

async function init() {
  await Mavis.LoadingScreen.init();
  await Mavis.Global.init();
  await Mavis.Data.init();
  await Mavis.Header.init();
  await Mavis.MainMenu.init();
  await Mavis.Pages.loadPage('report');
}

init();

 */

