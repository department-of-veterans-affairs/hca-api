const request = require('request');

const report = require('../report');
const config = require('../../../config');

// FIXME: This should come in from a config variable
const url = 'http://localhost:' + config.port; // eslint-disable-line

const common = require('../utils/common.js');

// TODO(awong): Move this into a custom command or assertion that can be used with client.expect.element().
function expectNavigateAwayFrom(client, urlSubstring) {
  client.expect.element('.js-test-location').attribute('data-location')
    .to.not.contain(urlSubstring).before(common.timeouts.normal);
}

function expectPageIsOn(client, urlSubstring) {
  client.expect.element('.js-test-location').attribute('data-location')
    .to.contain(urlSubstring).before(common.timeouts.normal);
}


// this is overwhelmingly similar to 00-required.js, except that it tries to submit
// each page without the required fields, ensuring that you can't advance.
module.exports = {
  'Begin application': (client) => {
    request({
      uri: `${url}/api/hca/v1/mock`,
      method: 'POST',
      json: {
        resource: 'application',
        verb: 'post',
        value: {
          formSubmissionId: '123fake-submission-id-339',
          timeStamp: '2016-06-14'
        }
      }
    });

    // Ensure introduction page renders.
    client
      .url(url)
      .waitForElementVisible('body', common.timeouts.normal)
      .assert.title('Apply for Health Care: Vets.gov')
      .waitForElementVisible('.form-panel', common.timeouts.slow)  // First render of React may be slow.
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/introduction');

    // Personal Information page.
    client.expect.element('input[name="fname"]').to.be.visible;
    // Try to advance without filling in any fields
    client.click('.form-panel .usa-button-primary');
    expectPageIsOn(client, '/veteran-information/personal-information');
    // Fill in one, but not all of the required fields
    client.setValue('input[name="fname"]', common.testValues.veteranFullName.first);
    client.click('.form-panel .usa-button-primary');
    expectPageIsOn(client, '/veteran-information/personal-information');
    // Fill in everything
    common.completePersonalInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/personal-information');

    // Birth information page.
    client.expect.element('select[name="veteranBirthMonth"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectPageIsOn(client, '/veteran-information/birth-information');
    common.completeBirthInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/birth-information');

    // Demographic information page.
    client.expect.element('select[name="gender"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectPageIsOn(client, '/veteran-information/demographic-information');
    common.completeDemographicInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/demographic-information');

    // Veteran Address page.
    client.expect.element('input[name="address"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectPageIsOn(client, '/veteran-information/veteran-address');
    common.completeVeteranAddress(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/veteran-address');

    // Contact Information Page.
    client.expect.element('input[name="email"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/contact-information');

    // Military Service Information Page.
    client.expect.element('select[name="lastServiceBranch"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectPageIsOn(client, '/military-service/service-information');
    common.completeMilitaryService(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/military-service/service-information');

    // Military Service Additional Information Page.
    client.expect.element('input[name="purpleHeartRecipient"] + label').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/military-service/additional-information');

    // VA Benefits Basic Info page.
    client.expect.element('input[name="compensableVaServiceConnected-0"] + label').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectPageIsOn(client, '/va-benefits/basic-information');
    common.completeVaBenefits(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/va-benefits/basic-information');

    // Financial disclosure page.
    client.expect.element('input[name="provideFinancialInfo-0"] + label').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectPageIsOn(client, '/household-information/financial-disclosure');
    common.completeFinancialDisclosure(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/financial-disclosure');

    // Spouse information Page.
    client.expect.element('select[name="maritalStatus"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectPageIsOn(client, '/household-information/spouse-information');
    common.completeSpouseInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/spouse-information');

    // Child Information Page.
    client.expect.element('input[name="hasChildrenToReport-0"] + label').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectPageIsOn(client, '/household-information/child-information');
    common.completeChildInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/child-information');

    // Annual Income Page.
    client.expect.element('input[name="veteranGrossIncome"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/annual-income');

    // Deductible Expenses Page.
    client.expect.element('input[name="deductibleMedicalExpenses"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/deductible-expenses');

    // Medicare and Medicaid Page.
    client.expect.element('input[name="isMedicaidEligible-0"] + label').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectPageIsOn(client, '/insurance-information/medicare');
    common.completeMedicareAndMedicaid(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/medicare');

    // Insurance Information Page.
    client.expect.element('input[name="isCoveredByHealthInsurance-0"] + label').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectPageIsOn(client, '/insurance-information/general');
    common.completeInsuranceInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/general');

    // Additional VA Insurance Information Page.
    client.expect.element('select[name="state"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectPageIsOn(client, '/insurance-information/va-facility');
    common.completeVaInsuranceInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/va-facility');

    // Review and Submit Page.
    client.expect.element('button.edit-btn').to.be.visible;

    client.expect.element('.form-panel .usa-button-primary').text.to.equal('Submit Application');
    client.click('.form-panel .usa-button-primary');
    client.expect.element('.form-panel .hca-button-green').text.to.equal('✓ Submitted');

    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/review-and-submit').before(common.timeouts.submission);

    // Submit message
    client.expect.element('.success-alert-box').to.be.visible;


    client.end();
  },
  tearDown: report
};
