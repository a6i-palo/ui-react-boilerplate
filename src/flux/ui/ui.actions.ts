import {action} from 'typesafe-actions';
import {TOGGLE_GLOBAL_MENU} from '~/flux/ui/ui.constants';

export const toggleGlobalMenu = (): {type: string} => action(TOGGLE_GLOBAL_MENU);
