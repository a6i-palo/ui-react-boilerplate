import {ConnectedRouter} from 'connected-react-router';
import React, {StrictMode, ReactNode} from 'react';
import {Provider} from 'react-redux';
import {Store} from 'redux';
import {IAppState, history} from '~/flux';
import {Route, Switch} from 'react-router';
import {routes} from '~/router';
import {NavbarContainer} from '~/components/Navbar/NavbarContainer';

interface IProps {
    store: Store<IAppState>;
}
class AppContainer extends React.Component<IProps, {}> {
    public render(): ReactNode {
        return (
            <Provider store={this.props.store}>
                <ConnectedRouter history={history}>
                    <StrictMode>
                        <NavbarContainer />
                        <Switch>
                            {routes.map((route, id) => (
                                <Route key={id} {...route} />
                            ))}
                        </Switch>
                    </StrictMode>
                </ConnectedRouter>
            </Provider>
        );
    }
}

export default AppContainer;
