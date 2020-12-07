import '../styles/main.scss';

import spark from '@sparkdesignsystem/spark/es5/spark';
import sparkPrerender from '@sparkdesignsystem/spark/es5/sparkPrerender';
import '@sparkdesignsystem/spark/es5/sparkPolyfills';

require('./buttons');
require('./autocomplete');

// initialize Spark
sparkPrerender();
spark();
