// A small, dependency-free math expression parser & evaluator.
// Supports: + - * x (as multiply) / ^ % ( ) sin cos tan log ln sqrt pi e
// and an optional variable "x" for function plotting.
// Uses the shunting-yard algorithm to avoid eval().

const FUNCTIONS = ["sin", "cos", "tan", "log", "ln", "sqrt"];
const CONSTANTS = { pi: Math.PI, "\u03c0": Math.PI, e: Math.E };

function tokenize(expr) {
  const src = expr
    .replace(/\u00d7/g, "*")
    .replace(/\u00f7/g, "/")
    .replace(/\u03c0/g, "pi")
    .toLowerCase()
    .replace(/\s+/g, "");

  const tokens = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];

    if (/[0-9.]/.test(ch)) {
      let num = ch;
      i++;
      while (i < src.length && /[0-9.]/.test(src[i])) {
        num += src[i];
        i++;
      }
      tokens.push({ type: "num", value: parseFloat(num) });
      continue;
    }

    if (/[a-z]/.test(ch)) {
      let name = ch;
      i++;
      while (i < src.length && /[a-z]/.test(src[i])) {
        name += src[i];
        i++;
      }
      if (FUNCTIONS.includes(name)) {
        tokens.push({ type: "func", value: name });
      } else if (name === "x") {
        tokens.push({ type: "var", value: "x" });
      } else if (CONSTANTS[name] !== undefined) {
        tokens.push({ type: "num", value: CONSTANTS[name] });
      } else {
        throw new Error(`Unknown identifier: ${name}`);
      }
      continue;
    }

    if ("+-*/^%(),".includes(ch)) {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }

    throw new Error(`Unexpected character: ${ch}`);
  }
  return tokens;
}

const PRECEDENCE = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2, "^": 3 };
const RIGHT_ASSOC = { "^": true };

function toRPN(tokens) {
  const output = [];
  const stack = [];

  // Insert implicit multiplication, e.g. 2(3) -> 2*(3), 2sin(x) -> 2*sin(x)
  const withImplicit = [];
  for (let idx = 0; idx < tokens.length; idx++) {
    const t = tokens[idx];
    const prev = tokens[idx - 1];
    if (
      prev &&
      (prev.type === "num" || (prev.type === "op" && prev.value === ")") || prev.type === "var") &&
      (t.type === "func" || t.type === "var" || t.type === "num" || (t.type === "op" && t.value === "("))
    ) {
      withImplicit.push({ type: "op", value: "*" });
    }
    withImplicit.push(t);
  }

  for (const t of withImplicit) {
    if (t.type === "num" || t.type === "var") {
      output.push(t);
    } else if (t.type === "func") {
      stack.push(t);
    } else if (t.value === ",") {
      while (stack.length && stack[stack.length - 1].value !== "(") {
        output.push(stack.pop());
      }
    } else if (t.value === "(") {
      stack.push(t);
    } else if (t.value === ")") {
      while (stack.length && stack[stack.length - 1].value !== "(") {
        output.push(stack.pop());
      }
      stack.pop(); // remove "("
      if (stack.length && stack[stack.length - 1].type === "func") {
        output.push(stack.pop());
      }
    } else {
      // handle unary minus
      const isUnary =
        t.value === "-" &&
        (withImplicit.indexOf(t) === 0 ||
          (() => {
            const i2 = withImplicit.indexOf(t);
            const p = withImplicit[i2 - 1];
            return p && p.type === "op" && p.value !== ")";
          })());
      if (isUnary) {
        output.push({ type: "num", value: 0 });
      }
      while (
        stack.length &&
        stack[stack.length - 1].type === "op" &&
        stack[stack.length - 1].value !== "(" &&
        (PRECEDENCE[stack[stack.length - 1].value] > PRECEDENCE[t.value] ||
          (PRECEDENCE[stack[stack.length - 1].value] === PRECEDENCE[t.value] && !RIGHT_ASSOC[t.value]))
      ) {
        output.push(stack.pop());
      }
      stack.push(t);
    }
  }
  while (stack.length) output.push(stack.pop());
  return output;
}

function evalRPN(rpn, x, useDegrees) {
  const stack = [];
  const toRad = (v) => (useDegrees ? (v * Math.PI) / 180 : v);

  for (const t of rpn) {
    if (t.type === "num") {
      stack.push(t.value);
    } else if (t.type === "var") {
      stack.push(x);
    } else if (t.type === "func") {
      const a = stack.pop();
      let r;
      switch (t.value) {
        case "sin": r = Math.sin(toRad(a)); break;
        case "cos": r = Math.cos(toRad(a)); break;
        case "tan": r = Math.tan(toRad(a)); break;
        case "log": r = Math.log10(a); break;
        case "ln": r = Math.log(a); break;
        case "sqrt": r = Math.sqrt(a); break;
        default: throw new Error(`Unknown function ${t.value}`);
      }
      stack.push(r);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (t.value) {
        case "+": stack.push(a + b); break;
        case "-": stack.push(a - b); break;
        case "*": stack.push(a * b); break;
        case "/": stack.push(a / b); break;
        case "%": stack.push(a % b); break;
        case "^": stack.push(Math.pow(a, b)); break;
        default: throw new Error(`Unknown operator ${t.value}`);
      }
    }
  }
  return stack.pop();
}

export function evaluateExpression(expr, { degrees = true } = {}) {
  const tokens = tokenize(expr);
  const rpn = toRPN(tokens);
  return evalRPN(rpn, undefined, degrees);
}

export function evaluateAtX(expr, xValue, { degrees = false } = {}) {
  const tokens = tokenize(expr);
  const rpn = toRPN(tokens);
  return evalRPN(rpn, xValue, degrees);
}
