# Klazapp Guard Kit

A lightweight, zero-dependency **TypeScript guard & validation toolkit**.
It provides **runtime safety**, **explicit error messages**, and **typed parsing helpers** for cleaner, more predictable code.

---

## ⭐ Why use this?

Most projects start with ad-hoc `if (!value)` checks. It works at first, but issues appear as codebases grow:

* Inconsistent error handling scattered across files
* Hard-to-trace runtime crashes from `null` or `undefined`
* Unsafe parsing of dates, numbers, or JSON
* Boilerplate validation cluttering business logic

**Klazapp Guard Kit** solves these by offering a focused set of **guard functions** and **typed parsers** that make validation **explicit, consistent, and ergonomic**.

---

### 🔍 Comparison

| Aspect              | Ad-hoc checks (`if`, `try/catch`)    | Guard Kit                                           |
| ------------------- | ------------------------------------ | --------------------------------------------------- |
| **Consistency**     | Different style in each function     | Centralized, reusable guards                        |
| **Error clarity**   | Vague `TypeError` / custom strings   | Structured errors (`BadRequest`, `NotFound`)        |
| **Type safety**     | Often loses type info                | Guards refine types with assertions                 |
| **Parsing**         | Manual `JSON.parse`, `new Date(...)` | Safe helpers (`parseArray.number`, `toDate.orNull`) |
| **Maintainability** | Boilerplate everywhere               | Lean handlers with predictable flow                 |

---

### ✅ Key benefits

* **Minimal core**: just the essentials (`require`, `expect`, `invariant`, type-safe parsers)
* **Typed runtime validation**: guards refine types automatically in TypeScript
* **Custom error classes**: semantic errors like `BadRequest` / `NotFound`
* **Safe parsing**: convert user input into well-typed values or throw clear errors
* **Extras opt-in**: opinionated helpers (date ranges, CSV parsing, env vars) available under a separate import path (`@klazapp/guard-kit/extra`)
* **Zero dependencies**: small, tree-shakeable, works in Node.js and browser

---

## 📦 Installation

### From npm

```bash
npm i @klazapp/guard-kit
```

---

## 🚀 Usage

### 1. Require a value

```ts
import { guard } from "@klazapp/guard-kit";

const id = guard.require(req.body.id, "Missing ID");
// id: string (non-null, non-undefined)
```

---

### 2. Safe parsing

```ts
const year = guard.toYear.orNull("2025-01-07");  // → 2025
const date = guard.toDate.orNull("not-a-date");  // → null
```

---

### 3. Parse arrays

```ts
const codes = guard.parseArray.number("ARRAY_NAME")("[1,2,3]"); 
// → [1, 2, 3]
```

Errors are labeled with the field name:

```
Invalid ARRAY_NAME: expected array
```

---

### 4. Advanced checks

```ts
guard.invariant(user.isActive, "Inactive user cannot log in");
const email = guard.matches(userInput, /^[^@]+@[^@]+$/, "Invalid email");
```

---

### 5. Extras (optional)

Import extra helpers only when needed:

```ts
import { guardExtra } from "@klazapp/guard-kit/extra";

const range = guardExtra.toDateRange("2025-01-01", "2025-01-07");
// validates order & returns normalized { start, end }
```

---

## 🗂 Import paths

```
@klazapp/guard-kit
├── guard             # Core guard helpers
├── errors            # Error classes (BadRequest, NotFound)
└── extra/            # Optional helpers
    ├── date.ts       # e.g. toDateRange, toISODateOnly
    ├── collection.ts # e.g. nonEmptyArray, unique
    └── parse.ts      # e.g. parseCsvNumbers
```

**Core (default, always available):**

```ts
import { guard } from "@klazapp/guard-kit";
import { BadRequest } from "@klazapp/guard-kit/errors";
```

**Extras (opt-in):**

```ts
import { guardExtra } from "@klazapp/guard-kit/extra";
```

---

## ⚙️ Errors

The kit ships with simple, extendable errors:

```ts
import { BadRequest, NotFound } from "@klazapp/guard-kit/errors";

throw new BadRequest("Invalid payload");
throw new NotFound("Resource not found");
```

---

## 📖 Roadmap

* [ ] Stronger collection validators (unique, non-empty, sorted)
* [ ] Built-in schema combinators (`object`, `array`, `union`)
* [ ] Async guards for external lookups

---

## 📜 License

MIT © Klazapp
