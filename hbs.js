// Import Handlebars runtime lib
const Handlebars = require('handlebars/runtime');

const helpers = require('handlebars-helpers')();

Handlebars.helpers = Object.assign(helpers, Handlebars.helpers);

Handlebars.registerHelper('concat', function() {
  var outStr = '';
  for(var arg in arguments){
      if(typeof arguments[arg]!='object'){
          outStr += arguments[arg];
      }
  }
  return outStr;
});

/**
 * Handlebars runtime with custom helpers.
 * Used by handlebars-loader.
 */
module.exports = Handlebars;
