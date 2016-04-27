require('../assets/css/main.scss');

// Get our browser up to date with polyfills.
const Modernizr = require('modernizr');
if (!Modernizr.classlist) {
  require('classlist-polyfill'); // DOM element classList support.
}
if (!Modernizr.dataset) {
  require('dataset');  // dataSet accessor support.
}

// This polyfill has its own test logic so no need to conditionally require.
require('polyfill-function-prototype-bind');

// Bring in foundation.
// TODO(awong): Do we need this? If so, can we remove jquery?
// require('foundation-sites');

const ReactEntry = require('./client/react-entry.jsx');
document.addEventListener('DOMContentLoaded', () => {
  ReactEntry.init();
});
window.ReactEntry = ReactEntry;  // Attach to window for easy debugging.
