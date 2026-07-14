(function(){
  'use strict';

  const root = document.querySelector('[data-calculator-root]');
  const prevEl = root.querySelector('[data-previous]');
  const currEl = root.querySelector('[data-current]');

  let state = {
    a: null, // first operand (number)
    b: null, // second operand (number)
    op: null, // '+', '-', '×', '÷'
    entering: 'a', // 'a' or 'b'
    currentStr: '0', // string of current number being typed
    error: null // error message string
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined || Number.isNaN(num)) return '0';
    const abs = Math.abs(num);
    // use locale formatting for thousands, cap precision to prevent floating errors
    if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
      return num.toExponential(6).replace(/e\+(\d+)/, 'e$1');
    }
    // Avoid rounding away typed decimals by converting to string with max 12 fractional digits
    const asStr = num.toLocaleString(undefined, { maximumFractionDigits: 12 });
    return asStr;
  };

  const setDisplay = (currentStr, previousText) => {
    currEl.textContent = currentStr;
    prevEl.textContent = previousText || '';
  };

  const clearAll = () => {
    state = { a: null, b: null, op: null, entering: 'a', currentStr: '0', error: null };
    setDisplay('0', '');
  };

  const setError = (msg) => {
    state.error = msg;
    setDisplay(msg, '');
  };

  const commitCurrentToOperand = () => {
    const val = Number(state.currentStr);
    if (state.entering === 'a') state.a = val; else state.b = val;
  };

  const inputDigit = (d) => {
    if (state.error) return; // ignore while in error until AC
    if (state.currentStr === '0') state.currentStr = d; else state.currentStr += d;
    commitCurrentToOperand();
    updateDisplay();
  };

  const inputDecimal = () => {
    if (state.error) return;
    if (!state.currentStr.includes('.')) {
      state.currentStr += (state.currentStr === '' ? '0.' : '.');
      commitCurrentToOperand();
      updateDisplay({ preserveRaw: true });
    }
  };

  const negate = () => {
    if (state.error) return;
    if (state.currentStr.startsWith('-')) state.currentStr = state.currentStr.slice(1);
    else if (state.currentStr !== '0') state.currentStr = '-' + state.currentStr;
    commitCurrentToOperand();
    updateDisplay({ preserveRaw: true });
  };

  const percent = () => {
    if (state.error) return;
    const val = Number(state.currentStr);
    state.currentStr = String(val / 100);
    commitCurrentToOperand();
    updateDisplay();
  };

  const del = () => {
    if (state.error) return;
    if (state.currentStr.length <= 1 || (state.currentStr.length === 2 && state.currentStr.startsWith('-'))) {
      state.currentStr = '0';
    } else {
      state.currentStr = state.currentStr.slice(0, -1);
    }
    commitCurrentToOperand();
    updateDisplay({ preserveRaw: true });
  };

  const chooseOperation = (op) => {
    if (state.error) return;
    // If we already have op and b, compute chaining
    if (state.op && state.entering === 'b' && state.currentStr !== '' && state.b !== null) {
      equals();
    }
    // set op
    state.op = op;
    state.entering = 'b';
    // if switching to b without typing yet, show a op
    if (state.currentStr === '' || state.currentStr === '-') {
      state.currentStr = '0';
    }
    // when moving to b, reset currentStr for fresh typing
    state.currentStr = '0';
    updateDisplay();
  };

  const compute = () => {
    const a = state.a ?? Number(state.currentStr);
    const b = state.b ?? Number(state.currentStr);
    switch (state.op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? Infinity : a / b;
      default: return Number(state.currentStr);
    }
  };

  const equals = () => {
    if (state.error) return;
    if (!state.op) return; // nothing to compute
    if (state.a === null) state.a = Number(state.currentStr);
    if (state.entering === 'a') { state.entering = 'b'; }
    if (state.b === null) state.b = Number(state.currentStr);

    if (state.op === '÷' && state.b === 0) {
      setError('Error');
      return;
    }

    const result = compute();
    state = { a: result, b: null, op: null, entering: 'a', currentStr: String(result), error: null };
    updateDisplay();
  };

  const updateDisplay = (opts = {}) => {
    const { preserveRaw = false } = opts;
    const prev = (state.op && state.a !== null)
      ? `${formatNumber(state.a)} ${state.op}`
      : '';

    let currentText;
    if (preserveRaw && /\.$/.test(state.currentStr)) {
      currentText = state.currentStr; // preserve trailing decimal
    } else if (preserveRaw) {
      currentText = state.currentStr;
    } else {
      currentText = formatNumber(Number(state.currentStr));
    }

    setDisplay(currentText, prev);
  };

  const onKey = (e) => {
    const key = e.key;
    if (/^\d$/.test(key)) { inputDigit(key); return; }
    if (key === '.') { inputDecimal(); return; }
    if (key === '+') { chooseOperation('+'); return; }
    if (key === '-') { chooseOperation('-'); return; }
    if (key === '*') { chooseOperation('×'); return; }
    if (key === '/') { chooseOperation('÷'); return; }
    if (key === '%') { percent(); return; }
    if (key === 'Enter' || key === '=') { equals(); return; }
    if (key === 'Backspace') { del(); return; }
    if (key === 'Escape') { clearAll(); return; }
  };

  // Event bindings
  root.querySelector('.keys').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const act = btn.dataset.action;
    switch (act) {
      case 'digit': inputDigit(btn.dataset.digit); break;
      case 'decimal': inputDecimal(); break;
      case 'operation': chooseOperation(btn.dataset.op); break;
      case 'equals': equals(); break;
      case 'clear': clearAll(); break;
      case 'delete': del(); break;
      case 'percent': percent(); break;
      case 'negate': negate(); break;
    }
    btn.blur();
  });

  document.addEventListener('keydown', onKey);

  // Initialize
  clearAll();
})();
