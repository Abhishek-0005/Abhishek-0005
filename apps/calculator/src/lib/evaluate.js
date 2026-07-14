// Expression evaluator supporting +, -, *, /, parentheses, and unary minus
// Implements shunting-yard to convert to RPN, then evaluates.

const isDigit = (ch) => /[0-9]/.test(ch)

function tokenize(input) {
  const tokens = []
  let i = 0
  let prevType = 'start' // 'start' | 'number' | 'op' | 'lparen' | 'rparen'

  while (i < input.length) {
    const ch = input[i]

    if (ch === ' ' || ch === '\t' || ch === '\n') { i++; continue }

    if (isDigit(ch) || ch === '.') {
      let numStr = ''
      let dotCount = 0
      while (i < input.length && (isDigit(input[i]) || input[i] === '.')) {
        if (input[i] === '.') {
          dotCount++
          if (dotCount > 1) throw new Error('Invalid number')
        }
        numStr += input[i]
        i++
      }
      if (numStr === '.' ) throw new Error('Invalid number')
      tokens.push({ type: 'number', value: parseFloat(numStr) })
      prevType = 'number'
      continue
    }

    if (ch === '+' || ch === '-' ) {
      // Determine unary or binary
      const isUnary = (prevType === 'start' || prevType === 'op' || prevType === 'lparen')
      tokens.push({ type: 'op', value: isUnary && ch === '-' ? 'u-' : ch })
      prevType = 'op'
      i++
      continue
    }

    if (ch === '*' || ch === '/') {
      tokens.push({ type: 'op', value: ch })
      prevType = 'op'
      i++
      continue
    }

    if (ch === '(') { tokens.push({ type: 'lparen', value: ch }); prevType = 'lparen'; i++; continue }
    if (ch === ')') { tokens.push({ type: 'rparen', value: ch }); prevType = 'rparen'; i++; continue }

    throw new Error('Invalid input')
  }

  return tokens
}

function toRPN(tokens) {
  const out = []
  const stack = []

  const prec = { '+': 1, '-': 1, '*': 2, '/': 2, 'u-': 3 }
  const rightAssoc = { 'u-': true }
  const arity = { '+': 2, '-': 2, '*': 2, '/': 2, 'u-': 1 }

  for (const t of tokens) {
    if (t.type === 'number') {
      out.push(t)
    } else if (t.type === 'op') {
      while (stack.length) {
        const top = stack[stack.length - 1]
        if (top.type !== 'op') break
        const shouldPop = (
          (!rightAssoc[t.value] && prec[t.value] <= prec[top.value]) ||
          (rightAssoc[t.value] && prec[t.value] < prec[top.value])
        )
        if (shouldPop) out.push(stack.pop())
        else break
      }
      stack.push(t)
    } else if (t.type === 'lparen') {
      stack.push(t)
    } else if (t.type === 'rparen') {
      let found = false
      while (stack.length) {
        const s = stack.pop()
        if (s.type === 'lparen') { found = true; break }
        out.push(s)
      }
      if (!found) throw new Error('Mismatched parentheses')
    }
  }

  while (stack.length) {
    const s = stack.pop()
    if (s.type === 'lparen' || s.type === 'rparen') throw new Error('Mismatched parentheses')
    out.push(s)
  }

  return { rpn: out, arity }
}

export function evaluate(expr) {
  const tokens = tokenize(expr)
  const { rpn, arity } = toRPN(tokens)

  const stack = []
  for (const t of rpn) {
    if (t.type === 'number') {
      stack.push(t.value)
    } else if (t.type === 'op') {
      const n = arity[t.value]
      if (n === 1) {
        if (stack.length < 1) throw new Error('Invalid expression')
        const a = stack.pop()
        if (t.value === 'u-') stack.push(-a)
        else throw new Error('Invalid operator')
      } else if (n === 2) {
        if (stack.length < 2) throw new Error('Invalid expression')
        const b = stack.pop()
        const a = stack.pop()
        let res
        switch (t.value) {
          case '+': res = a + b; break
          case '-': res = a - b; break
          case '*': res = a * b; break
          case '/':
            if (b === 0) throw new Error('Division by zero')
            res = a / b; break
          default: throw new Error('Invalid operator')
        }
        stack.push(res)
      } else {
        throw new Error('Invalid operator')
      }
    }
  }

  if (stack.length !== 1) throw new Error('Invalid expression')
  return stack[0]
}
