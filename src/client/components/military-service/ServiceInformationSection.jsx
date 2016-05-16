import React from 'react';
import { connect } from 'react-redux';

import DateInput from '../form-elements/DateInput';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import { branchesServed, dischargeTypes } from '../../utils/options-for-select.js';
import { veteranUpdateField } from '../../actions';
import { displayLabel } from '../../store/calculated';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class ServiceInformationSection extends React.Component {

  render() {
    let content;

    const selectedLastServiceBranch = this.props.data.lastServiceBranch.value;
    const selectedDischargeType = this.props.data.dischargeType.value;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Last branch of service:</td>
            <td>{displayLabel(branchesServed, selectedLastServiceBranch)}</td>
          </tr>
          <tr>
            <td>Last entry date:</td>
            <td>{this.props.data.lastEntryDate.month.value}/
        {this.props.data.lastEntryDate.day.value}/{this.props.data.lastEntryDate.year.value}</td>
          </tr>
          <tr>
            <td>Last discharge date:</td>
            <td>{this.props.data.lastDischargeDate.month.value}/
        {this.props.data.lastDischargeDate.day.value}/{this.props.data.lastDischargeDate.year.value}</td>
          </tr>
          <tr>
            <td>Discharge Type:</td>
            <td>{displayLabel(dischargeTypes, selectedDischargeType)}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        <legend>Service Information</legend>
        <div className="input-section">
          <ErrorableSelect
              label="Last branch of service"
              options={branchesServed}
              value={this.props.data.lastServiceBranch}
              onValueChange={(update) => {this.props.onStateChange('lastServiceBranch', update);}}/>

          <DateInput label="Last entry date"
              day={this.props.data.lastEntryDate.day}
              month={this.props.data.lastEntryDate.month}
              year={this.props.data.lastEntryDate.year}
              onValueChange={(update) => {this.props.onStateChange('lastEntryDate', update);}}/>

          <DateInput label="Last discharge date"
              day={this.props.data.lastDischargeDate.day}
              month={this.props.data.lastDischargeDate.month}
              year={this.props.data.lastDischargeDate.year}
              onValueChange={(update) => {this.props.onStateChange('lastDischargeDate', update);}}/>

          <ErrorableSelect
              label="Discharge Type"
              options={dischargeTypes}
              value={this.props.data.dischargeType}
              onValueChange={(update) => {this.props.onStateChange('dischargeType', update);}}/>
        </div>
      </fieldset>);
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    isSectionComplete: state.uiState.sections['/military-service/service-information'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(ServiceInformationSection);
export { ServiceInformationSection };
