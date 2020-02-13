import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from '~/AppContainer';
import {createAndInitStore} from '~/flux';

import './styles/main.scss';

const init = async (): Promise<void> => {
    const store = await createAndInitStore();

    ReactDOM.render(<AppContainer store={store} />, document.getElementById('app'));
};

init();
