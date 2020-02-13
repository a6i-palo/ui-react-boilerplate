import {SagaIterator} from 'redux-saga';
import {all, select, takeLatest} from 'redux-saga/effects';
import {TOGGLE_GLOBAL_MENU} from '~/flux/ui/ui.constants';
import {IUiState} from '~/flux/ui/ui.reducer';
import {getUiState} from '~/flux/ui/ui.selectors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* toggleMenu(): SagaIterator {
    const currentState: IUiState = yield select(getUiState);
    // eslint-disable-next-line no-console
    console.log(`Global Menu Trigggered: ${currentState.globalMenuState}`);
}

export function* UiSaga(): SagaIterator {
    yield all([takeLatest(TOGGLE_GLOBAL_MENU, toggleMenu)]);
}
