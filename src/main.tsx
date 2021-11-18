import ReactDOM from 'react-dom';
import { App } from './App';

import '@fontsource/roboto-mono/300.css';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import '@fontsource/roboto-mono/700.css';

import { registerSW } from 'virtual:pwa-register';

ReactDOM.render(<App />, document.getElementById('root'));

registerSW();
