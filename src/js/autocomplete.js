import {
  isEnterPressed,
  isTabPressed,
  isDownPressed,
  isUpPressed,
  isEscPressed
} from '@sparkdesignsystem/spark/es5/sparkExports';

const filteredOutClass = "filtered-out";
const noSelectAttribute = 'data-sprk-autocomplete-no-select';
const noneFoundAttribute = 'data-myapp-autocomplete-no-results-found';
const activeClass = 'sprk-c-Autocomplete__results--active';
const pinnedAttribute = 'data-sprk-myapp-autocomplete-pinned';
const spinnerAttribute = 'data-myapp-autocomplete-loading';

// Returns childNode's first ancestor node of type ancestorNodeType, or null
const getFirstAncestorOfType = (childNode, ancestorNodeType) => {
  var node = childNode.parentNode;
  while (node != null) {
    if (node.tagName == ancestorNodeType) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

const setupAutocomplete = (container) => {

  const input = container.querySelector('input');
  const list = container.querySelector('ul');
  const liveAnnouncer = container.querySelector('[aria-live]');

  const isListOpen = (list) => {
    return !list.classList.contains('sprk-u-Display--none');
  };

  const resetResults = (resultList) => {
    resultList.forEach((result) => {
      if (result.hasAttribute(pinnedAttribute)) {
        // strip out the highlight
        result.querySelector('span[data-myapp-filter-text]').innerHTML = '';
      } else if (result.hasAttribute(noneFoundAttribute)) {
        // dont do anything to the 404
      } else if (result.hasAttribute(spinnerAttribute)) {
        // dont do anything to the loading spinner
      } else {
        result.classList.remove(filteredOutClass);
        result.classList.remove(activeClass);
        result.removeAttribute(noSelectAttribute);
        result.removeAttribute('aria-selected');

        // if it has highlighted text, strip that out
        if (result.querySelector('.highlighted')) {
          const outerText = result.querySelector('.highlighted').outerHTML;
          const innerText = result.querySelector('.highlighted').innerHTML;
          result.innerHTML = result.innerHTML.replace(outerText, innerText);
        }
      }
    });
  };

  const hideList = (list, input) => {
    if (isListOpen(list)) {
      resetResults(list.querySelectorAll('li'));
      list.classList.add('sprk-u-Display--none');
      input.removeAttribute('aria-activedescendant');
      input.parentNode.setAttribute('aria-expanded', false);
    }
  };

  const showList = (list, input) => {
    list.classList.remove('sprk-u-Display--none');
    input.parentNode.setAttribute('aria-expanded', 'true')
  }

  const filterList = (list, filterString, liveAnnouncer) => {
    const listItems =
      list.querySelectorAll('li:not([' + noneFoundAttribute + '])');
    resetResults(listItems);
    const matchingResults = [];

    listItems.forEach((listItem) => {
      // pinned results are always visible
      if (listItem.hasAttribute(pinnedAttribute)) {
        listItem.querySelector('span[data-myapp-filter-text]')
          .innerHTML = filterString;
        matchingResults.push(listItem);
      } else {
        if (filterString.length === 0) {
          // empty filter displays everything
          matchingResults.push(listItem);
        } else {
          let foundMatch = false;
          if (listItem.childNodes.length > 1) {
            listItem.childNodes.forEach((childNode) => {
              if (childNode.innerHTML) {
                const startIndex = childNode.innerHTML.toLowerCase()
                  .indexOf(filterString.toLowerCase());
                if (startIndex !== -1) {
                  foundMatch = true;
                  const endIndex = startIndex + filterString.length;

                  // not necessarily identical to the filter because of caps
                  const replacedString =
                    childNode.innerHTML.substring(startIndex, endIndex);

                  childNode.innerHTML = childNode.innerHTML.replace(
                    replacedString,
                    '<span class="highlighted">' + replacedString + '</span>'
                  )
                }
              }
            });
          } else {
            const startIndex =
              listItem.innerHTML.toLowerCase()
                .indexOf(filterString.toLowerCase());
            if (startIndex !== -1) {
              foundMatch = true;
              const endIndex = startIndex + filterString.length;

              // not necessarily identical to the filter because of caps
              const replacedString =
                listItem.innerHTML.substring(startIndex, endIndex);

              listItem.innerHTML = listItem.innerHTML.replace(
                replacedString,
                '<span class="highlighted">' + replacedString + '</span>'
              )
            }
          }

          if (foundMatch) {
            matchingResults.push(listItem);
          } else {
            listItem.classList.add(filteredOutClass)
            listItem.setAttribute(noSelectAttribute, true);
          }
        }
      }
    })

    const noneFoundItem =
      container.querySelector('li[' + noneFoundAttribute + ']');
    if (matchingResults.length === 0) {
      liveAnnouncer.innerText = "0 results found.";
      noneFoundItem && noneFoundItem.classList.remove(filteredOutClass);
    } else {
      liveAnnouncer.innerText = matchingResults.length + " results found.";
      noneFoundItem && noneFoundItem.classList.add(filteredOutClass);
    }
  }

  const selectItem = (list, listItem, input) => {
    const inputValue = listItem.getAttribute('data-myapp-autocomplete-value');
    const textValue = listItem.getAttribute('data-myapp-autocomplete-text');

    input.setAttribute('data-myapp-autocomplete-value', inputValue);
    input.value = textValue;
    resetResults(list.querySelectorAll('li'));
    hideList(list, input);

    // handle the demo case for showing error state
    const errorContainer = document.querySelector('#input--error-container5');
    const errorTextContainer =
      errorContainer.querySelector('.sprk-b-ErrorText');
    if (input.getAttribute('data-myapp-autocomplete-value') === 'cucumber') {
      input.classList.add('sprk-b-TextInput--error');
      errorContainer.classList.remove('sprk-u-Display--none');
      errorTextContainer.innerText = "This is not a fruit.";
    } else {
      input.classList.remove('sprk-b-TextInput--error');
      errorContainer.classList.add('sprk-u-Display--none');
      errorTextContainer.innerText = "";
    }
  }

  const simulateApiSearch = (searchString) => {
    return [
      {
        displayString: `123 <span class="highlighted">${searchString}</span> Road`,
        selectedString: `123 ${searchString} Road`,
        valueString: 'result1',
      },
      {
        displayString: `579 Hiram Road, <span class="highlighted">${searchString}</span>, MI`,
        selectedString: `579 Hiram Road, ${searchString}, MI`,
        valueString: 'result2',
      },
      {
        displayString: `<span class="highlighted">${searchString}</span> Inc, 1 Campus Martius`,
        selectedString: `${searchString} Inc, 1 Campus Martius`,
        valueString: 'result3',
      },
      {
        displayString: `191  Stratford Park <span class="highlighted">${searchString}</span> Lane`,
        selectedString: `191  Stratford Park ${searchString} Lane`,
        valueString: 'result4',
      },
      {
        displayString: `2410  <span class="highlighted">${searchString}</span> Ridge Drive`,
        selectedString: `2410  ${searchString} Ridge Drive`,
        valueString: 'result5',
      },
    ];
  }

  const buildSearchResult = (displayString, selectedString, valueString) => {
    let listItem = document.createElement('li');
    listItem.innerHTML = displayString;
    listItem.classList.add('sprk-c-Autocomplete__result');
    listItem.setAttribute('data-myapp-autocomplete-text', selectedString);
    listItem.setAttribute('data-myapp-autocomplete-value', valueString);
    listItem.id = 'address_' + valueString;
    return listItem;
  }

  const doDynamicSearch = (list, input, liveAnnouncer) => {
    const filterText = input.value.trim();
    const spinner = list.querySelector('[data-myapp-autocomplete-loading]')
    showList(list, input);
    spinner.classList.remove('sprk-u-Display--none');

    let interval;

    interval = setInterval(() => {
       // remove the old entries
      list.querySelectorAll('li:not([data-myapp-autocomplete-loading])')
        .forEach((node) => { node.remove() }
      );

      const searchResults = simulateApiSearch(filterText);

      searchResults.forEach((result) => {
        list.appendChild(
          buildSearchResult(
            result.displayString, result.selectedString, result.valueString
          )
        );
      });

      liveAnnouncer.innerText = "5 results found.";
      spinner.classList.add('sprk-u-Display--none');
      clearInterval(interval);
    }, 3000)
  }

  input.addEventListener('focusin', (e) => {
    filterList(list, input.value.trim(), liveAnnouncer);
    showList(list, input);
  });

  input.addEventListener('blur', (e) => {
    if (input.hasAttribute('data-myapp-autocomplete-no-freeform')) {
      if (input.value) {
        // if the selected value is not one of the items in the list, clear the value
        const possibleValues = list.querySelectorAll('[data-myapp-autocomplete-text]');
        let found = false;

        possibleValues.forEach((listItem) => {
          if (listItem.getAttribute('data-myapp-autocomplete-text') === input.value) {
            found = true;
          }
        })

        if (!found) {
          input.value = "";
          input.removeAttribute('data-myapp-autocomplete-value');
        }
      }
    }
  })

  input.addEventListener('keydown', (e) => {
    if (isTabPressed(e)) {
      hideList(list, input);
    }
  });

  input.addEventListener('keyup', (e) => {
    // ignore the key events that are handled by spark
    if (isDownPressed(e) || isUpPressed(e)) {
      showList(list, input);
    } else if (isEscPressed(e)) {
      // do nothing; let Spark handle it
    } else if (isEnterPressed(e)) {
      if (input.hasAttribute('aria-activedescendant')) {
        selectItem(
          list,
          list.querySelector('#' + input.getAttribute('aria-activedescendant')),
          input
        )
      }
    } else {
      if (container.hasAttribute('data-myapp-autocomplete-dynamic')) {
        // do a google maps search
        doDynamicSearch(list, input, liveAnnouncer);
      } else {
        // typing in the input
        filterList(list, input.value.trim(), liveAnnouncer);
        showList(list, input);
      }
    }
  });

  container.addEventListener('click', (e) => {
    let clickedTarget = e.target;

    if (clickedTarget.tagName !== 'LI') {
      // if e is not a LI, check to see if it is nested in a LI
      const listItem = getFirstAncestorOfType(clickedTarget, 'LI')
      if (listItem) {
        selectItem(list, listItem, input);
      }
    }

    if (clickedTarget.tagName === 'LI') {
      if (clickedTarget.hasAttribute(noSelectAttribute) ||
        clickedTarget.hasAttribute(noneFoundAttribute)) {
        // ignore click
      } else {

        selectItem(list, clickedTarget, input);
      }
    }
  })
}

const allAutocompletes = document.querySelectorAll('[data-sprk-autocomplete="container"]');
allAutocompletes.forEach((autocomplete) => { setupAutocomplete(autocomplete) });