import _ from 'lodash';

function validateIfDirty(field, validator) {
  if (field.dirty) {
    return validator(field.value);
  }

  return true;
}

function validateIfDirtyDate(dayField, monthField, yearField, validator) {
  if (dayField.dirty || monthField.dirty || yearField.dirty) {
    return validator(dayField.value, monthField.value, yearField.value);
  }

  return true;
}

function validateIfDirtyProvider(field1, field2, validator) {
  if (field1.dirty || field2.dirty) {
    return validator(field1.value, field2.value);
  }

  return true;
}

function isBlank(value) {
  return value === '';
}

function isNotBlank(value) {
  return value !== '';
}

// Conditions for valid SSN from the original 1010ez pdf form:
// '123456789' is not a valid SSN
// A value where the first 3 digits are 0 is not a valid SSN
// A value where the 4th and 5th digits are 0 is not a valid SSN
// A value where the last 4 digits are 0 is not a valid SSN
// A value with 3 digits, an optional -, 2 digits, an optional -, and 4 digits is a valid SSN
// 9 of the same digits (e.g., '111111111') is not a valid SSN
function isValidSSN(value) {
  if (value === '123456789' || value === '123-45-6789') {
    return false;
  } else if (/1{9}|2{9}|3{9}|4{9}|5{9}|6{9}|7{9}|8{9}|9{9}/.test(value)) {
    return false;
  } else if (/^0{3}-?\d{2}-?\d{4}$/.test(value)) {
    return false;
  } else if (/^\d{3}-?0{2}-?\d{4}$/.test(value)) {
    return false;
  } else if (/^\d{3}-?\d{2}-?0{4}$/.test(value)) {
    return false;
  }

  for (let i = 1; i < 10; i++) {
    const sameDigitRegex = new RegExp(`${i}{3}-?${i}{2}-?${i}{4}`);
    if (sameDigitRegex.test(value)) {
      return false;
    }
  }

  return /^\d{3}-?\d{2}-?\d{4}$/.test(value);
}

function isValidDate(day, month, year) {
  // Use the date class to see if the date parses back sanely as a
  // validation check. Not sure is a great idea...
  const adjustedMonth = Number(month) - 1;  // JS Date object 0-indexes months. WTF.
  const date = new Date(year, adjustedMonth, day);
  const today = new Date();

  if (today < date) {
    return false;
  }

  return date.getDate() === Number(day) &&
    date.getMonth() === adjustedMonth &&
    date.getFullYear() === Number(year);
}

function isValidName(value) {
  return /^[a-zA-Z][a-zA-Z '\-]*$/.test(value);
}

function isValidMonetaryValue(value) {
  if (value !== null) {
    return /^\d+\.?\d*$/.test(value);
  }
  return true;
}

// TODO: look into validation libraries (npm "validator")
function isValidPhone(value) {
  return /^\d{3}-\d{3}-\d{4}$/.test(value);
}

function isValidEmail(value) {
  // Comes from StackOverflow: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
}

// TODO:  1. what is a valid address?
//        2. 6 arguments to a function is ugly...
//        3. argument order is now based on form order... using
function isValidAddress(street, city, country, state, zipcode) {
  // arbitraty use of field to keep linter happy until we answer #1
  if (isNotBlank(street.value) && isNotBlank(city.value) && isNotBlank(country.value) && isNotBlank(state.value) && isNotBlank(zipcode.value)) {
    return true;
  }

  return true;
}

function isValidInsurancePolicy(policyNumber, groupCode) {
  if (policyNumber !== null || groupCode !== null) {
    return isNotBlank(policyNumber) || isNotBlank(groupCode);
  }
  return true;
}

function isValidField(validator, field) {
  return isBlank(field.value) || validator(field.value);
}

function isValidRequiredField(validator, field) {
  return isNotBlank(field.value) || validator(field.value);
}

function isBlankDateField(field) {
  return isBlank(field.day.value) && isBlank(field.month.value) && isBlank(field.year.value);
}

function isValidDateField(field) {
  return isValidDate(field.day.value, field.month.value, field.year.value);
}

function isBlankFullNameField(field) {
  return isBlank(field.first.value) && isBlank(field.middle.value) && isBlank(field.last.value);
}

function isValidFullNameField(field) {
  return isValidName(field.first.value) &&
    (isBlank(field.middle.value) || isValidName(field.middle.value)) &&
    isValidName(field.last.value);
}

function isBlankAddressField(field) {
  return isBlank(field.street.value) &&
    isBlank(field.city.value) &&
    isBlank(field.country.value) &&
    isBlank(field.state.value) &&
    isBlank(field.zipcode.value);
}

function isValidAddressField(field) {
  return isValidAddress(field.street.value, field.city.value, field.country.value, field.state.value, field.zipcode.value);
}

function isValidWhoAreYouPanel1(data) {
  return isValidFullNameField(data.fullName) &&
      isValidRequiredField(isValidSSN, data.socialSecurityNumber) &&
      isValidDateField(data.dateOfBirth);
}

function isValidWhoAreYouPanel2(data) {
  return isNotBlank(data.gender.value) &&
      isNotBlank(data.maritalStatus);
}

function isValidVaInformation(data) {
  return validateIfDirty(data.isVaServiceConnected, isNotBlank) &&
      validateIfDirty(data.compensableVaServiceConnected, isNotBlank) &&
      validateIfDirty(data.receivesVaPension, isNotBlank);
}

function isValidAdditionalInformation(data) {
  return validateIfDirty(data.facilityState, isNotBlank) &&
    validateIfDirty(data.vaMedicalFacility, isNotBlank);
}

function isValidVeteranAddress(data) {
  return isValidAddressField(data.address) &&
      isValidField(isValidEmail, data.email) &&
      isValidField(isValidEmail, data.emailConfirmation) &&
      isValidField(isValidPhone, data.homePhone) &&
      isValidField(isValidPhone, data.mobilePhone);
}

function isValidSpouseInformation(data) {
  return (isBlankFullNameField(data.spouseFullName) || isValidFullNameField(data.spouseFullName)) &&
      isValidField(isValidSSN, data.spouseSocialSecurityNumber) &&
      (isBlankDateField(data.spouseDateOfBirth) || isValidDateField(data.spouseDateOfBirth)) &&
      (isBlankDateField(data.dateOfMarriage) || isValidDateField(data.dateOfMarriage)) &&
      (isBlankAddressField(data.spouseAddress) || isValidAddressField(data.spouseAddress)) &&
      isValidField(isValidPhone, data.spousePhone);
}

function isValidChildInformationField(child) {
  return isValidFullNameField(child.childFullName) &&
    isNotBlank(child.childRelation.value) &&
    isValidRequiredField(isValidSSN, child.childSocialSecurityNumber) &&
    isValidDateField(child.childBecameDependent) &&
    isValidDateField(child.childDateOfBirth) &&
    isValidField(isValidMonetaryValue, child.childEducationExpenses);
}

function isValidChildren(data) {
  const children = data.children;
  if (!data.hasChildrenToReport) {
    return true;
  }
  for (let i = 0; i < children.length; i++) {
    if (!isValidChildInformationField(children[i])) {
      return false;
    }
  }
  return true;
}

function isValidChildrenIncome(data) {
  const children = data.children;
  if (children.length === 0) {
    return true;
  }
  for (let i = 0; i < children.length; i++) {
    if (
        !isValidField(isValidMonetaryValue, children[i].childrenGrossIncome) &&
        !isValidField(isValidMonetaryValue, children[i].childrenNetIncome) &&
        !isValidField(isValidMonetaryValue, children[i].childrenOtherIncome)
    ) {
      return false;
    }
  }
  return true;
}

function isValidAnnualIncome(data) {
  return isValidField(isValidMonetaryValue, data.veteranGrossIncome) &&
    isValidField(isValidMonetaryValue, data.veteranNetIncome) &&
    isValidField(isValidMonetaryValue, data.veteranOtherIncome) &&
    isValidField(isValidMonetaryValue, data.spouseGrossIncome) &&
    isValidField(isValidMonetaryValue, data.spouseNetIncome) &&
    isValidField(isValidMonetaryValue, data.spouseOtherIncome) &&
    isValidChildrenIncome(data);
}

function isValidDeductibleExpenses(data) {
  return isValidField(isValidMonetaryValue, data.deductibleMedicalExpenses) &&
    isValidField(isValidMonetaryValue, data.deductibleFuneralExpenses) &&
    isValidField(isValidMonetaryValue, data.deductibleEducationExpenses);
}

function isValidGeneralInsurance(data) {
  const providers = data.providers;
  if (!data.isCoveredByHealthInsurance) {
    return true;
  }
  for (let i = 0; i < providers.length; i++) {
    if (!(isNotBlank(providers[i].insuranceName) &&
        isNotBlank(providers[i].insurancePolicyHolderName) &&
        isValidInsurancePolicy(providers[i].insurancePolicyNumber, providers[i].insuranceGroupCode))
    ) {
      return false;
    }
  }
  return true;
}

function isValidMedicareMedicaid(data) {
  return isBlankDateField(data.medicarePartAEffectiveDate) ||
    isValidDateField(data.medicarePartAEffectiveDate);
}

function isValidServiceInformation(data) {
  return (isBlankDateField(data.lastEntryDate) || isValidDateField(data.lastEntryDate)) &&
         (isBlankDateField(data.lastDischargeDate) || isValidDateField(data.lastDischargeDate));
}

function isValidSection(completePath, sectionData) {
  switch (completePath) {
    case '/who-are-you/panel1':
      return isValidWhoAreYouPanel1(sectionData);
    // case '/who-are-you/panel2':
    //   return isValidWhoAreYouPanel2(sectionData);
    // case '/who-are-you/panel3':
    //   return isValidAdditionalInformation(sectionData);
    // case '/who-are-you/veteran-address':
    //   return isValidVeteranAddress(sectionData);
    // case '/financial-assessment/panel3':
    //   return isValidSpouseInformation(sectionData);
    // case '/financial-assessment/panel4':
    //   return isValidChildren(sectionData);
    // case '/financial-assessment/panel1':
    //   return isValidAnnualIncome(sectionData);
    // case '/financial-assessment/panel2':
    //   return isValidDeductibleExpenses(sectionData);
    // case '/insurance-information/general':
    //   return isValidGeneralInsurance(sectionData);
    // case '/insurance-information/medicare-medicaid':
    //   return isValidMedicareMedicaid(sectionData);
    // case 'military-service/panel1':
    //   return isValidServiceInformation(sectionData);
    default:
      return true;
  }
}

function initializeNullValues(value) {
  if (value === null) {
    return '';
  } else if (_.isPlainObject(value)) {
    return _.mapValues(value, (v, _k) => { return initializeNullValues(v); });
  } else if (_.isArray(value)) {
    return value.map(initializeNullValues);
  }

  return value;
}

export {
  validateIfDirty,
  validateIfDirtyDate,
  validateIfDirtyProvider,
  initializeNullValues,
  isBlank,
  isNotBlank,
  isValidDate,
  isValidName,
  isValidSSN,
  isValidMonetaryValue,
  isValidPhone,
  isValidEmail,
  isValidAddress,
  isValidInsurancePolicy,
  isValidField,
  isValidWhoAreYouPanel1,
  isValidWhoAreYouPanel2,
  isValidVaInformation,
  isValidAdditionalInformation,
  isValidVeteranAddress,
  isValidSpouseInformation,
  isValidChildren,
  isValidAnnualIncome,
  isValidChildrenIncome,
  isValidDeductibleExpenses,
  isValidGeneralInsurance,
  isValidMedicareMedicaid,
  isValidServiceInformation,
  isValidSection
};
