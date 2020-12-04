import { setSpinning, cancelSpinning } from '@sparkdesignsystem/spark';

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