// presets
import {combineReducers} from "redux";

// importing reducers
import {
    selectedPokemon,
    selectedRandomPokemon,
    battleReducer,
    passedWinnerInfo,
    passedDisplaySetting,
    passedTransformationInfo,
    passedColorInfo
} from "./reducers.jsx";

// combined reducers
const allReducers = combineReducers({
        selectedPokemon,
        selectedRandomPokemon,
        battleReducer,
        passedWinnerInfo,
        passedDisplaySetting,
        passedTransformationInfo,
        passedColorInfo
    });

export default allReducers;