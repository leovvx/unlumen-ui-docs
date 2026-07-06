const MAX_EXPRESSION_LENGTH = 256;
const MAX_TOKENS = 128;
const MAX_DEPTH = 32;

type Token =
  | { type: "number"; value: number }
  | { type: "identifier"; value: string }
  | { type: "operator"; value: "+" | "-" | "*" | "/" | "^" }
  | { type: "leftParen" | "rightParen" | "comma" };

type Expression =
  | { type: "number"; value: number }
  | { type: "variable" }
  | { type: "unary"; operator: "+" | "-"; value: Expression }
  | {
      type: "binary";
      operator: "+" | "-" | "*" | "/" | "^";
      left: Expression;
      right: Expression;
    }
  | { type: "call"; name: keyof typeof FUNCTIONS; args: Expression[] };

const FUNCTIONS = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  atan2: Math.atan2,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  log: Math.log,
  log2: Math.log2,
  log10: Math.log10,
  exp: Math.exp,
  pow: Math.pow,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  min: Math.min,
  max: Math.max,
  sign: Math.sign,
} as const;

function tokenize(source: string): Token[] | null {
  if (!source.trim() || source.length > MAX_EXPRESSION_LENGTH) return null;

  const tokens: Token[] = [];
  let position = 0;

  while (position < source.length) {
    const character = source[position]!;
    if (/\s/.test(character)) {
      position += 1;
      continue;
    }

    const rest = source.slice(position);
    const number = /^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i.exec(rest);
    if (number) {
      tokens.push({ type: "number", value: Number(number[0]) });
      position += number[0].length;
      continue;
    }

    const identifier = /^[A-Za-z]+/.exec(rest);
    if (identifier) {
      tokens.push({ type: "identifier", value: identifier[0] });
      position += identifier[0].length;
      continue;
    }

    if (character === "*") {
      const isExponent = source[position + 1] === "*";
      tokens.push({ type: "operator", value: isExponent ? "^" : "*" });
      position += isExponent ? 2 : 1;
      continue;
    }
    if (
      character === "+" ||
      character === "-" ||
      character === "/" ||
      character === "^"
    ) {
      tokens.push({ type: "operator", value: character });
      position += 1;
      continue;
    }
    if (character === "(") tokens.push({ type: "leftParen" });
    else if (character === ")") tokens.push({ type: "rightParen" });
    else if (character === ",") tokens.push({ type: "comma" });
    else return null;
    position += 1;

    if (tokens.length > MAX_TOKENS) return null;
  }

  return tokens;
}

class Parser {
  private position = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): Expression | null {
    const expression = this.parseSum(0);
    return expression && this.position === this.tokens.length
      ? expression
      : null;
  }

  private peek(): Token | undefined {
    return this.tokens[this.position];
  }

  private consume(type: Token["type"]): Token | null {
    const token = this.peek();
    if (!token || token.type !== type) return null;
    this.position += 1;
    return token;
  }

  private parseSum(depth: number): Expression | null {
    let expression = this.parseProduct(depth + 1);
    while (expression) {
      const token = this.peek();
      if (
        token?.type !== "operator" ||
        (token.value !== "+" && token.value !== "-")
      )
        break;
      this.position += 1;
      const right = this.parseProduct(depth + 1);
      if (!right) return null;
      expression = {
        type: "binary",
        operator: token.value,
        left: expression,
        right,
      };
    }
    return expression;
  }

  private parseProduct(depth: number): Expression | null {
    let expression = this.parsePower(depth + 1);
    while (expression) {
      const token = this.peek();
      if (
        token?.type !== "operator" ||
        (token.value !== "*" && token.value !== "/")
      )
        break;
      this.position += 1;
      const right = this.parsePower(depth + 1);
      if (!right) return null;
      expression = {
        type: "binary",
        operator: token.value,
        left: expression,
        right,
      };
    }
    return expression;
  }

  private parsePower(depth: number): Expression | null {
    const left = this.parseUnary(depth + 1);
    if (!left) return null;
    const token = this.peek();
    if (token?.type !== "operator" || token.value !== "^") return left;
    this.position += 1;
    const right = this.parsePower(depth + 1);
    return right ? { type: "binary", operator: "^", left, right } : null;
  }

  private parseUnary(depth: number): Expression | null {
    if (depth > MAX_DEPTH) return null;
    const token = this.peek();
    if (
      token?.type === "operator" &&
      (token.value === "+" || token.value === "-")
    ) {
      this.position += 1;
      const value = this.parseUnary(depth + 1);
      return value ? { type: "unary", operator: token.value, value } : null;
    }
    return this.parsePrimary(depth + 1);
  }

  private parsePrimary(depth: number): Expression | null {
    if (depth > MAX_DEPTH) return null;
    const token = this.peek();
    if (!token) return null;
    if (token.type === "number") {
      this.position += 1;
      return { type: "number", value: token.value };
    }
    if (token.type === "leftParen") {
      this.position += 1;
      const expression = this.parseSum(depth + 1);
      return expression && this.consume("rightParen") ? expression : null;
    }
    if (token.type !== "identifier") return null;

    this.position += 1;
    if (token.value === "x") return { type: "variable" };
    if (token.value === "PI") return { type: "number", value: Math.PI };
    if (token.value === "E") return { type: "number", value: Math.E };
    if (!(token.value in FUNCTIONS) || !this.consume("leftParen")) return null;

    const args: Expression[] = [];
    if (this.peek()?.type !== "rightParen") {
      while (true) {
        const argument = this.parseSum(depth + 1);
        if (!argument) return null;
        args.push(argument);
        if (!this.consume("comma")) break;
      }
    }
    return this.consume("rightParen")
      ? { type: "call", name: token.value as keyof typeof FUNCTIONS, args }
      : null;
  }
}

function evaluate(expression: Expression, x: number): number {
  switch (expression.type) {
    case "number":
      return expression.value;
    case "variable":
      return x;
    case "unary": {
      const value = evaluate(expression.value, x);
      return expression.operator === "-" ? -value : value;
    }
    case "binary": {
      const left = evaluate(expression.left, x);
      const right = evaluate(expression.right, x);
      switch (expression.operator) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return left / right;
        case "^":
          return left ** right;
      }
    }
    case "call": {
      const fn = FUNCTIONS[expression.name] as unknown as (
        ...values: number[]
      ) => number;
      return fn(...expression.args.map((arg) => evaluate(arg, x)));
    }
  }
}

export function evaluateMathExpression(
  source: string,
  x: number,
): number | null {
  const tokens = tokenize(source);
  if (!tokens) return null;
  const expression = new Parser(tokens).parse();
  if (!expression) return null;
  const result = evaluate(expression, x);
  return Number.isFinite(result) ? result : null;
}
