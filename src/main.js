import {render, h} from 'preact';
import { Provider } from 'preact-redux';

import {store} from './store';
import Routes from './routes';

import 'material-design-lite/material';
import './style/import.scss';

render(
  <Provider store={store}>
      <Routes />
  </Provider>,
  document.querySelector('#App')
);

if ('serviceWorker' in navigator && location.protocol === 'https:') {
    console.log('Starting service worker...');
    navigator.serviceWorker.register('service-worker.js', { scope: "./" })
        .then((reg) => {
            console.log('Done. Now you\'re running offline.');
        })
        .catch((err) => {
            console.log(err);
        })
}