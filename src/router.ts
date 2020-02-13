import {RouteProps} from 'react-router-dom';
import {Gists} from '~/components/Gists/Gists';

export const routes: RouteProps[] = [{path: '/gists', exact: true, component: Gists}];
