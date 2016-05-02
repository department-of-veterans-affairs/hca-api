import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { UPDATE_COMPLETION_STATUS, UPDATE_REVIEW_STATUS, UPDATE_SUBMISSION_STATUS } from '../../actions';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);


const ui = {
  applicationSubmitted: false,
  completedSections: {
    '/introduction': false,
    '/who-are-you/panel1': false,
    '/who-are-you/panel2': false,
    '/who-are-you/panel3': false,
    '/how-do-we-reach-you/panel1': false,
    '/how-do-we-reach-you/panel2': false,
    '/other-insurance/panel2': false,
    '/other-insurance/panel1': false,
    'military-service/panel1': false,
    'military-service/panel2': false,
    '/financial-assessment/panel3': false,
    '/financial-assessment/panel4': false,
    '/financial-assessment/panel1': false,
    '/financial-assessment/panel2': false,
    '/review-and-submit': false
  }
};

function uiState(state = ui, action) {
  let newState = undefined;
  switch (action.type) {
    case UPDATE_COMPLETION_STATUS:
      newState = Object.assign({}, state);
      _.set(newState.completedSections, action.path, true);
      return newState;

    case UPDATE_REVIEW_STATUS:
      newState = Object.assign({}, state);
      _.set(newState.completedSections, action.path, action.value);
      return newState;

    case UPDATE_SUBMISSION_STATUS:
      newState = Object.assign({}, state);
      _.set(newState, action.field, true);
      return newState;

    default:
      return state;
  }
}

export default uiState;
