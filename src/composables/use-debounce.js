export function useDebounce(func, wait, immediate) {
  var timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/* Usage
var myEfficientFn = useDebounce(function() {
	// All the taxing stuff you do
}, 250);

window.addEventListener('resize', myEfficientFn);
*/
