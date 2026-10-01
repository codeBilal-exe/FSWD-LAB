<div align="center">

<img src="favicon.png" alt="Bilal monogram logo" width="150">

# FSWD Lab Portal

From a first `<div>` to a working e-commerce store, every lab lives here and runs in the browser.

[![Live Portal](https://img.shields.io/badge/Live%20Portal-Open%20▸-d4af37?style=for-the-badge&logo=github&logoColor=white)](https://codebilal-exe.github.io/FSWD-LAB/)
[![Labs](https://img.shields.io/badge/Labs-4-d4af37?style=for-the-badge)](https://codebilal-exe.github.io/FSWD-LAB/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://codebilal-exe.github.io/FSWD-LAB/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952b3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Status](https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge)](https://github.com/codeBilal-exe/FSWD-LAB)

[**🚀 Open the Live Portal →**](https://codebilal-exe.github.io/FSWD-LAB/)

</div>

---

## Overview

This repository collects my **Full Stack Web Development** lab work in one place. It has a **live portal** that finds every task on its own and lets you open the running page and read its source side by side.

| | |
| -------------- | --------------------------------------- |
| 🎓 **Course**  | Full Stack Web Development (FSWD)       |
| 🧑‍💻 **Author**  | Muhammad Bilal                          |
| 🛠 **Stack**   | HTML5 · CSS3 · JavaScript · Bootstrap 5 |
| 🌐 **Hosting** | GitHub Pages                            |

---

## How the Portal Works

The root [`index.html`](index.html) is a small site that drills down in three levels:

```text
 Home            ──▶   Lab page          ──▶   Task page
 one card per lab      one card per task       live preview + source inspector
```

- **Auto-discovery:** reads the repo tree from the GitHub API — new folders appear automatically.
- **Source inspector:** every HTML, CSS and JS file is listed and syntax-highlighted.
- **JS Runner:** pure JavaScript tasks can be compiled and run directly in the portal with console output shown.
- **Light and dark themes:** an obsidian and champagne-gold dark mode, plus a light mode.
- **Multi-page tasks, one card:** a task folder with many pages gets a single card that opens `index.html`.

---

## Labs

### LAB-1 — HTML · CSS · JavaScript

| Task | What it is | Tech |
| ---- | ---------- | ---- |
| [Calculator UI](LAB-1/) | A working calculator with a styled keypad | HTML · CSS · JS |

### LAB-2 — HTML · CSS Layouts

| Task | What it is | Tech |
| ---- | ---------- | ---- |
| [Class Timetable](LAB-2/Task-1_TIMETABLE/)           | Weekly timetable laid out in a table            | HTML · CSS |
| [Facebook Home](LAB-2/Task-2_FACEBOOK/)              | Pixel-minded clone of the Facebook home screen  | HTML · CSS |
| [Portfolio](LAB-2/Task-3_PORTFOLIO/)                 | Personal portfolio site                         | HTML · CSS |
| [Custom UI: Classroom Next](LAB-2/Task-4_CUSTOM_UI/) | A semester dashboard concept                    | HTML · CSS |
| [IEEE Paper Template](LAB-2/Task-5_IEEE_PAPER/)      | Two-column IEEE-style paper layout              | HTML · CSS |

### LAB-3 — Bootstrap 5

| Task | What it is | Tech |
| ---- | ---------- | ---- |
| [Bootstrap Redo of Lab 2](LAB-3/Task-1_BOOTSTRAP_REDO_LAB2/) | All five Lab 2 tasks rebuilt with Bootstrap's grid and components | Bootstrap 5 |
| [**E-commerce UI**](LAB-3/Task-2_ECOMMERCE_UI/)              | A full store front end: signup to checkout                        | Bootstrap 5 · JS |

### LAB-4 — JavaScript Fundamentals

| Task | What it is | Tech |
| ---- | ---------- | ---- |
| [task1_biography.js](LAB-4/task1_biography.js)             | `var` primitive types & nested JS biography object | JS |
| [task2_next_prime.js](LAB-4/task2_next_prime.js)           | Find next prime using loops & `let` keyword        | JS |
| [task3_phone_number.js](LAB-4/task3_phone_number.js)       | Phone number formatter from array of digits        | JS |
| [task4_roundMe.js](LAB-4/task4_roundMe.js)                 | Variable-argument `roundMe()` function             | JS |
| [task5_abs_ceil_floor.js](LAB-4/task5_abs_ceil_floor.js)   | Multi-arg `abs()`, `ceil()`, `floor()` functions   | JS |
| [task6_sum_of_multiples.js](LAB-4/task6_sum_of_multiples.js) | Sum of multiples of x or y below z              | JS |

> **Tip:** Click **▶ Compile** in the portal to run any LAB-4 script and see its console output live.

---

## Lab 3 Spotlight — Frostline E-commerce

The Lab 3 capstone is **Frostline**, a complete e-commerce front end for a winter jacket brand. It needs no backend: the cart, account and reviews are stored with `localStorage`.

**Pages:** `index` · `shop` · `product` · `signup` · `login` · `reviews` · `cart` · `checkout`

| Feature | Details |
| ------- | ------- |
| 🏔 **Hero section**       | Full-width snowy mountain photo with a gradient overlay          |
| 🧥 **Product listing**    | 8 jackets with live search, category filter and sorting          |
| 🔍 **Product page**       | Size and quantity pickers, ratings, a toast after adding to cart |
| 🛍 **Cart**               | Add, edit quantities with +/−, remove, live totals               |
| 🏷 **Promo and shipping** | Code `WINTER10` gives 10% off, and shipping is free over $150    |
| ✅ **Checkout**           | Validated shipping and payment form, then an order confirmation  |
| 🔐 **Signup and login**   | Bootstrap validation, password match, session-aware navbar       |
| ⭐ **Reviews**            | Average rating, seed reviews, and a form that saves new ones     |

**Demo flow:** browse jackets → add to bag → try `WINTER10` in the cart → check out.

---

## Folder Structure

```text
FSWD-LAB/
├── index.html                        ← Live Portal
├── favicon.png
├── README.md
│
├── LAB-1/
│   ├── L1-calculator.html
│   ├── L1-calculator-style.css
│   └── calculato-fun.js
│
├── LAB-2/
│   ├── Task-1_TIMETABLE/
│   ├── Task-2_FACEBOOK/
│   ├── Task-3_PORTFOLIO/
│   ├── Task-4_CUSTOM_UI/
│   └── Task-5_IEEE_PAPER/
│
├── LAB-3/
│   ├── Task-1_BOOTSTRAP_REDO_LAB2/
│   └── Task-2_ECOMMERCE_UI/
│
└── LAB-4/                            ← JS Fundamentals
    ├── task1_biography.js
    ├── task2_next_prime.js
    ├── task3_phone_number.js
    ├── task4_roundMe.js
    ├── task5_abs_ceil_floor.js
    └── task6_sum_of_multiples.js
```

---

## Running Locally

```bash
git clone https://github.com/codeBilal-exe/FSWD-LAB.git
cd FSWD-LAB

# Serve locally (portal requires a server for GitHub API calls)
python -m http.server 8000
# then open http://localhost:8000
```

Individual tasks can also be opened by double-clicking their `index.html`. Only the **portal's auto-discovery** needs a server.

---

## Adding a New Lab

1. Create `LAB-<number>/Task-<number>_<NAME>/`.
2. Put the task's pages and assets inside, with an `index.html` as the entry page.
3. Commit and push to `main`.

The portal picks it up automatically — no card markup needed.

> **Note:** a folder with several HTML files is treated as **one** task. For JS-only tasks, the portal shows a **▶ Compile** button to run the script in-browser.

---

## Credits

- [Bootstrap 5.3](https://getbootstrap.com/)
- [highlight.js](https://highlightjs.org/)
- [Google Fonts](https://fonts.google.com/)
- Product photography in the store demo: [Unsplash](https://unsplash.com/)

---

<div align="center">

**Built lab by lab by [Muhammad Bilal](https://github.com/codeBilal-exe)**

<img src="favicon.png" alt="" width="48">

_If this helped you, a ⭐ is always appreciated._

</div>
