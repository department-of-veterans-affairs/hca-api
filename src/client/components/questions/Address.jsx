import React from 'react';
import _ from 'lodash';

import ErrorableSelect from '../form-elements/ErrorableSelect';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isBlank, isNotBlank, validateIfDirty } from '../../utils/validations';
import { countries, states } from '../../utils/options-for-select';

/**
 * Input component for an address.
 *
 * No validation is provided through a currently stubbed isAddressValid function.
 */
class Address extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.validateAddressField = this.validateAddressField.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId('address-input-');
  }

  // TODO: Look into if this is the best way to update address,
  // it is incredibly slow right now
  handleChange(path, update) {
    const address = {
      street: this.props.value.street,
      city: this.props.value.city,
      country: this.props.value.country,
      state: this.props.value.state,
      zipcode: this.props.value.zipcode
    };

    address[path] = update;

    this.props.onUserInput(address);
  }

  validateAddressField(field) {
    if (this.props.required) {
      return validateIfDirty(field, isNotBlank);
    }

    return validateIfDirty(field, isBlank) || validateIfDirty(field, isNotBlank);
  }

  render() {
    let stateList = [];
    const selectedCountry = this.props.value.country.value;
    if (states[selectedCountry]) {
      stateList = states[selectedCountry];
    } else {
      stateList.push('Foreign Country');
    }

    return (
      <div>
        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.value.street) ? undefined : 'Please enter a valid street address'}
            label="Street"
            name="address"
            autocomplete="street-address"
            field={this.props.value.street}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('street', update);}}/>

        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.value.city) ? undefined : 'Please enter a valid city'}
            label="City"
            name="city"
            autocomplete="address-level2"
            field={this.props.value.city}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('city', update);}}/>

        <ErrorableSelect errorMessage={this.validateAddressField(this.props.value.country) ? undefined : 'Please enter a valid country'}
            label="Country"
            name="country"
            autocomplete="country"
            options={countries}
            value={this.props.value.country}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('country', update);}}/>

        <ErrorableSelect errorMessage={this.validateAddressField(this.props.value.state) ? undefined : 'Please enter a valid state'}
            label="State"
            name="state"
            autocomplete="address-level1"
            options={stateList}
            value={this.props.value.state}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('state', update);}}/>

        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.value.zipcode) ? undefined : 'Please enter a valid ZIP code'}
            label="ZIP Code"
            name="zip"
            autocomplete="postal-code"
            field={this.props.value.zipcode}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('zipcode', update);}}/>
      </div>
    );
  }
}

export default Address;

