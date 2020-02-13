import {connectRouter, routerMiddleware, RouterState} from 'connected-react-router';
import {applyMiddleware, combineReducers, compose, createStore, Store} from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as reducers from '~/flux/index.reducers';
import {IUiState} from '~/flux/index.reducers';
import {createBrowserHistory} from 'history';
import {rootSaga} from '~/flux/index.sagas';

export interface IAppState {
    readonly router: RouterState;
    readonly ui: IUiState;
}

export const history = createBrowserHistory({basename: '/'});

const appReducer = combineReducers<IAppState>({
    router: connectRouter(history),
    ...reducers,
});

const sagaMiddleware = createSagaMiddleware();

const middleware = [routerMiddleware(history), sagaMiddleware];

// Pass an optional param to rehydrate state on app start
const configureStore = (initialState?: object): Store => {
    // TODO: Create a configuration module to manage environment
    // TypeScript definitions for devtools in /my-globals/index.d.ts
    const reduxDevtools = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

    const composeEnhancers = reduxDevtools || compose;

    // create store
    return createStore(appReducer, initialState, composeEnhancers(applyMiddleware(...middleware)));
};

export const createAndInitStore = async (): Promise<Store> => {
    const store = configureStore();
    sagaMiddleware.run(rootSaga);
    return store;
};
