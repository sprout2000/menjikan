import ReactDOM from 'react-dom';
import { App } from './App';

import { registerSW } from 'virtual:pwa-register';

ReactDOM.render(<App />, document.getElementById('root'));

registerSW();
