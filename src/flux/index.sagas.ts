import {SagaIterator} from 'redux-saga';
import {spawn} from 'redux-saga/effects';
import {UiSaga} from '~/flux/ui/ui.sagas';

export function* rootSaga(): SagaIterator {
    yield spawn(UiSaga);
}
