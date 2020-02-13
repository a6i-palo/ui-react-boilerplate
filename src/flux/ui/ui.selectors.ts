import {IUiState} from '~/flux/ui/ui.reducer';
import {IAppState} from '~/flux';

export const getUiState = (state: IAppState): IUiState => state.ui;
