export const ADD_TO_FRQUENTLY_USED = 'ADD_TO_FRQUENTLY_USED';

const initialState = {
  emotions: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TO_FRQUENTLY_USED:
      return {
        ...state,
        emotions: [...state.emotions, action.payload],
        // emotions: [],
      };
    default:
      return state;
  }
}

const addToFrequentlyUsed = (model) => ({
  type: ADD_TO_FRQUENTLY_USED,
  payload: model,
});

export const addEmotionToFrequentlyUsed = (model) => (dispatch) => {
  dispatch(addToFrequentlyUsed(model));
};
