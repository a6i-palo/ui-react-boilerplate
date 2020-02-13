import {connect, MapDispatchToProps, MapStateToProps} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router';
import {toggleGlobalMenu} from '~/flux/ui/ui.actions';
import {IAppState} from '~/flux';
import {Navbar} from './Navbar';

export interface INavbarStateProps {
    menuState: boolean;
}

export interface INavbarDispatchProps {
    toggleMenu: () => void;
}

export const mapStateToProps: MapStateToProps<INavbarStateProps, {}, IAppState> = ({ui}): INavbarStateProps => ({
    menuState: ui.globalMenuState,
});

export const mapDispatchToProps: MapDispatchToProps<INavbarDispatchProps, {}> = (dispatch): INavbarDispatchProps => ({
    toggleMenu: (): void => {
        dispatch(toggleGlobalMenu());
    },
});

export type INavbarProps = INavbarStateProps & INavbarDispatchProps & RouteComponentProps<{id: string}>;

export const NavbarContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));
