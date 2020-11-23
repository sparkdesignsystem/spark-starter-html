import '../styles/main.scss';

import spark from '@sparkdesignsystem/spark/es5/spark';
import sparkPrerender from '@sparkdesignsystem/spark/es5/sparkPrerender';
import '@sparkdesignsystem/spark/es5/sparkPolyfills';

import { setSpinning, cancelSpinning } from '@sparkdesignsystem/spark';

// initialize Spark
sparkPrerender();
spark();

window.startSpinners = (classname) => {
  const spinningButtons = document.querySelectorAll('.' + classname)
  spinningButtons.forEach((button) => {
    setSpinning(button, {});
  })
}

window.resetSpinners = (classname) => {
  const spinningButtons = document.querySelectorAll('.sprk-c-Button--has-spinner.' + classname);
  spinningButtons.forEach((button) => {
    cancelSpinning(button);
  })
}