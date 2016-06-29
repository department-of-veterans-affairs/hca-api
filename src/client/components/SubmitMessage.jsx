import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class SubmitMessage extends React.Component {
  render() {
    const time = this.props.submission.timestamp;
    return (
      <div>
        <div className="medium-2 columns">
          <i className="fa fa-check-circle hca-success-icon"></i>
        </div>
        <div className="medium-10 columns">
          <h4 className="success-copy">You have successfully submitted your application for health care!</h4>
        </div>
        <div>
          <p>We are processing your application.  Upon completion of our review, the Department of Veterans Affairs will contact you.</p>
          <div className="success-alert-box">
            <p className="success-copy">Form Submitted At: {moment(time).format('MMMM Do YYYY, h:mm A')}</p>
          </div>
          <p>Please print this page for your records.</p>
          <p>If you have questions, call 1-877-222-VETS (8387) and select press 2.</p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    submission: state.uiState.submission
  };
}
// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(SubmitMessage);
export { SubmitMessage };
