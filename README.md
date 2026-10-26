# Technical Growth Showcase

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Test Runner](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

A curated collection of production-grade engineering challenges, distributed system resilience patterns, and algorithmic solutions with automated test coverage.

---

## 🎯 About This Repository

I created this repository as a transparent, auditable portfolio of my problem-solving approach and technical standards. Every solution in here is one that I have worked through on my interview preparation journey to arrive at what I believe is a thoughtful and production ready solution. That means the concepts you see on display here are ones I understand and can put to use in production systems.

Rather than treating coding challenges as quick syntax puzzles or superficial LeetCode submissions, every challenge in this repository is built to reflect **production engineering rigor**:
* **Defensive Engineering & Resilience**: Addressing real-world failure modes such as network partitions, service degradation, and thundering herd stampedes.
* **Type Safety & Expressive APIs**: Strict typing, explicit interfaces, and clear contracts using modern TypeScript and Python.
* **Deterministic Automated Testing**: Comprehensive unit tests covering happy paths, edge cases, boundary conditions, and fault tolerance.

---

## 📚 Problem Catalog

### 1. Distributed Systems & Resilience Patterns

| Challenge | Language | Core Pattern / Architecture | Implementation | Test Suite |
| :--- | :--- | :--- | :--- | :--- |
| **Exponential Backoff with Full Jitter** | TypeScript | Prevents thundering herd problems against recovering downstream services. Implements exponential backoff, configurable jitter, maximum delay caps, and error predicate filtering. | [`retryWithBackoff.ts`](./typescript/retryWithBackoff.ts) | [`retryWithBackoff.test.ts`](./typescript/retryWithBackoff.test.ts) |
| **Round-Robin Load Balancer with Health Checks** | Python | L7 software load balancer dynamically distributing requests across an upstream server pool while actively monitoring and respecting server health states and preventing deadlocks. | [`round_robin_load_balancer.py`](./python/round_robin_load_balancer.py) | *Unit tests in progress* |

### 2. Core Algorithms & Data Structures

| Challenge | Language | Key Focus / Data Structures | Implementation | Test Suite |
| :--- | :--- | :--- | :--- | :--- |
| *Upcoming solutions* | TS / Python | String search algorithms, dynamic programming, concurrency primitives, and graph traversals. | *(Ongoing)* | *(Ongoing)* |

---

## 🛠️ Engineering Standards

Every solution committed to this repository adheres to the following engineering tenets:

1. **Strict Type Safety**: TypeScript is configured with strict type checking enabled; Python implementations leverage PEP 484 type hints.
2. **Deterministic Test Coverage**: Tests are fast, isolated, and repeatable. Timing-dependent code (e.g., backoff intervals) uses mock timers or deterministic assertions.
3. **Failure Mode Handling**: Zero-healthy states, exhausted retries, negative inputs, and network rejections are explicitly anticipated and tested.
4. **Clean Code & Self-Documenting Design**: Descriptive naming, minimal cognitive overhead, and modular functions that adhere to Single Responsibility Principles (SRP).

---

## 🚀 Running Tests Locally

### Prerequisites
* **Node.js**: v18+ and `npm`
* **Python**: 3.10+

### TypeScript Suite (Vitest)
The TypeScript suite uses [Vitest](https://vitest.dev/) for fast unit test execution.

```bash
# Navigate to typescript directory
cd typescript

# Install dependencies (first time only)
npm install

# Run automated unit tests
npm test

# Run tests in watch mode during development
npx vitest
```

### Python Suite
```bash
# Navigate to the repository root
cd /path/to/technical-growth-showcase

# Run via unittest
python3 -m unittest discover -s python -p "*test*.py"
```

Feel free to explore the implementations and test suites.
