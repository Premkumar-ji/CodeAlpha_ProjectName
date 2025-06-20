const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let resultDisplayed = false;

function updateDisplay(value) {
  display.value = value.replace(/\*/g, '×').replace(/\//g, '÷');
}

function parseAndEvaluate(expr) {
  try {
    // Replace display operators with JavaScript operators
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/');
    // Tokenize numbers (integers and decimals) and operators
    const tokens = expr.match(/(?:\d+\.\d+|\d+|[+\-*/])/g);
    if (!tokens) return 'Error';

    const output = [];
    const operators = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

    for (let token of tokens) {
      if (!isNaN(token)) {
        output.push(parseFloat(token));
      } else if (['+', '-', '*', '/'].includes(token)) {
        while (
          operators.length &&
          precedence[operators[operators.length - 1]] >= precedence[token]
        ) {
          output.push(operators.pop());
        }
        operators.push(token);
      }
    }

    while (operators.length) {
      output.push(operators.pop());
    }

    const stack = [];
    for (let token of output) {
      if (typeof token === 'number') {
        stack.push(token);
      } else {
        const b = stack.pop();
        const a = stack.pop();
        if (token === '+') stack.push(a + b);
        else if (token === '-') stack.push(a - b);
        else if (token === '*') stack.push(a * b);
        else if (token === '/') stack.push(b === 0 ? 'Error' : a / b);
      }
    }

    const result = stack[0];
    return isNaN(result) || !isFinite(result) ? 'Error' : result;
  } catch {
    return 'Error';
  }
}

function removeActiveClassFromNumberButtons() {
  buttons.forEach(button => {
    if (button.getAttribute('data-number') !== null) {
      button.classList.remove('active');
    }
  });
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const number = button.getAttribute('data-number');
    const action = button.getAttribute('data-action');

    // Remove active class from all number buttons and add to the clicked button
    removeActiveClassFromNumberButtons();
    if (number !== null || action !== null) {
      button.classList.add('active');
    }

    if (number !== null) {
      if (resultDisplayed) {
        if (!/[+\-×÷]$/.test(currentInput)) {
          currentInput = number === '.' ? '0.' : number;
        } else {
          currentInput += number;
        }
        resultDisplayed = false;
      } else {
        const lastToken = currentInput.split(/[+\-×÷]/).pop();
        if (number === '.' && lastToken.includes('.')) return;
        currentInput += number;
      }
      updateDisplay(currentInput);
    } else if (action !== null) {
      const operators = {
        add: '+',
        subtract: '-',
        multiply: '×',
        divide: '÷'
      };

      switch (action) {
        case 'clear':
          currentInput = '';
          updateDisplay('');
          resultDisplayed = false;
          break;
        case 'backspace':
          currentInput = currentInput.slice(0, -1);
          updateDisplay(currentInput);
          resultDisplayed = false;
          break;
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
          if (currentInput === '') return;
          const op = operators[action];
          const lastChar = currentInput.slice(-1);
          if (['+', '-', '×', '÷'].includes(lastChar)) {
            currentInput = currentInput.slice(0, -1) + op;
          } else {
            currentInput += op;
          }
          updateDisplay(currentInput);
          resultDisplayed = false;
          break;
        case 'equals':
          if (currentInput === '') return;
          const result = parseAndEvaluate(currentInput);
          updateDisplay(result.toString());
          currentInput = result === 'Error' ? '' : result.toString();
          resultDisplayed = true;
          break;
      }
    }
  });
});

document.addEventListener('keydown', (e) => {
  const key = e.key;
  const isOperator = ['+', '-', '*', '/'].includes(key);

  // Map keyboard operators to display operators
  let inputKey = key;
  if (key === '*') inputKey = '×';
  if (key === '/') inputKey = '÷';

  // Remove active class from all number buttons on valid key press
  if (
    (key >= '0' && key <= '9') ||
    key === '.' ||
    isOperator ||
    key === 'Enter' ||
    key === '=' ||
    key === 'Backspace' ||
    key.toLowerCase() === 'c'
  ) {
    removeActiveClassFromNumberButtons();
  }

  if ((key >= '0' && key <= '9') || key === '.') {
    if (resultDisplayed) {
      if (!/[+\-×÷]$/.test(currentInput)) {
        currentInput = key === '.' ? '0.' : key;
      } else {
        currentInput += key;
      }
      resultDisplayed = false;
    } else {
      const lastToken = currentInput.split(/[+\-×÷]/).pop();
      if (key === '.' && lastToken.includes('.')) return;
      currentInput += key;
    }
    updateDisplay(currentInput);
  } else if (key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
    resultDisplayed = false;
  } else if (key === 'Enter' || key === '=') {
    if (currentInput === '') return;
    const result = parseAndEvaluate(currentInput);
    updateDisplay(result.toString());
    currentInput = result === 'Error' ? '' : result.toString();
    resultDisplayed = true;
  } else if (isOperator) {
    if (currentInput === '') return;
    const lastChar = currentInput.slice(-1);
    if (['+', '-', '×', '÷'].includes(lastChar)) {
      currentInput = currentInput.slice(0, -1) + inputKey;
    } else {
      currentInput += inputKey;
    }
    updateDisplay(currentInput);
    resultDisplayed = false;
  } else if (key.toLowerCase() === 'c') {
    currentInput = '';
    updateDisplay('');
    resultDisplayed = false;
  }
});