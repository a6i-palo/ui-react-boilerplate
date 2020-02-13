import {ActionType} from 'typesafe-actions';
import * as actions from '~/flux/ui/ui.actions';
import {TOGGLE_GLOBAL_MENU} from './ui.constants';

export interface IUiState {
    globalMenuState: boolean;
}

const initialState: IUiState = {
    globalMenuState: false,
};

export type UiActionType = ActionType<typeof actions>;

export const ui = (state: IUiState = initialState, action: UiActionType): IUiState => {
    switch (action.type) {
        case TOGGLE_GLOBAL_MENU:
            return {
                ...state,
                globalMenuState: !state.globalMenuState,
            };
        default:
            return state;
    }
};
