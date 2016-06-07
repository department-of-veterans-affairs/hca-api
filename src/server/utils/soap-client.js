'use strict'; // eslint-disable-line
const fs = require('fs');
const request = require('request');
const soap = require('soap');

const soapClient = (options) => {

  const config = options.config;
  const readTLSArtifacts = () => {
    const artifacts = {};

    // If either the client cert or key is set, try to read both and die hard if
    // either fails. It's nonsensical to have one without the other and it's hard to
    // debug a server that doesn't have a cert/key when you think it does so
    // hard dying is good here on a configuration error.
    if (config.soap.clientKeyPath || config.soap.clientCertPath) {
      artifacts.key = fs.readFileSync(config.soap.clientKeyPath);
      artifacts.cert = fs.readFileSync(config.soap.clientCertPath);
    }

    // The server CA is all public information and should always be checked in.
    if (Array.isArray(config.soap.serverCA)) {
      artifacts.ca = config.soap.serverCA.map((path) => fs.readFileSync(path));
    } else {
      artifacts.ca = fs.readFileSync(config.soap.serverCA);
    }

    return artifacts;
  };

  const tlsArtifacts = readTLSArtifacts();

  const wsdlUri = config.soap.wsdl || `${config.soap.endpoint}?wsdl`;
  soap.createClient(
    wsdlUri,
    {
      request: request.defaults(tlsArtifacts),
      endpoint: config.soap.endpoint,
      wsdl_options: tlsArtifacts  // eslint-disable-line
    },
    (err, client) => {
      // TODO(awong): Handle error on connect so the server does not flap if the ES system is down.
      if (err) {
        options.logger.error('SOAP Client creation failed - ERROR', err);
        throw new Error('Unable to connect to VoaService');
      }
      return client;
    });
};

module.exports = soapClient;
