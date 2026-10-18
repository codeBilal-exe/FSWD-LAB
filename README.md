 <div align="center">

<img src="favicon.png" alt="Bilal monogram" width="112">

# FSWD Lab Portal

**A collection of web development labs, brought together in one interactive portal.**

HTML · CSS · JavaScript · Bootstrap

[**Open Live Portal →**](https://codebilal-exe.github.io/FSWD-LAB/)

<br>

![Status](https://img.shields.io/badge/Status-Active-3F8068?style=flat-square)
![Labs](https://img.shields.io/badge/Labs-6-C5A15B?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-9A7B32?style=flat-square)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square)

</div>

---

## About

FSWD Lab Portal brings my Full Stack Web Development coursework into a single, browsable website. Instead of navigating folders manually, you can explore each lab, open its tasks, preview web pages, and inspect the source code directly in the browser.

The portal discovers tasks from the repository structure, keeping the interface maintainable as new labs are added.

| | |
|:--|:--|
| **Course** | Full Stack Web Development |
| **Author** | Muhammad Bilal |
| **Technologies** | HTML5, CSS3, JavaScript, Bootstrap 5 |
| **Deployment** | GitHub Pages |

## The Portal

The portal uses a simple three-level navigation structure:

```text
Home
 └── Lab
      └── Task
           ├── Live preview
           ├── Source inspector
           └── JavaScript runner (where supported)
```

### Features

- **Automatic discovery** — finds lab folders and tasks through the GitHub API.
- **Live preview** — opens task pages directly in the portal.
- **Source inspector** — browses HTML, CSS, and JavaScript with syntax highlighting.
- **JavaScript runner** — executes supported JavaScript exercises and displays console output.
- **Light and dark themes** — includes an obsidian-and-champagne dark theme, a light alternative, and a compact animated sun/moon switch.
- **Multi-page task support** — groups related pages into one task card, using `index.html` as the entry point.

## Labs

### Lab 01 — HTML, CSS and JavaScript

| Task | Description |
|:--|:--|
| [Calculator](LAB-1/) | A functional calculator with a custom keypad and styling. |

### Lab 02 — HTML and CSS Layouts

| Task | Description |
|:--|:--|
| [Class Timetable](LAB-2/Task-1_TIMETABLE/) | A weekly timetable built with HTML tables and CSS. |
| [Facebook Home](LAB-2/Task-2_FACEBOOK/) | A recreation of the Facebook home screen layout. |
| [Portfolio](LAB-2/Task-3_PORTFOLIO/) | A personal portfolio website. |
| [Classroom Next](LAB-2/Task-4_CUSTOM_UI/) | A custom semester and classroom dashboard concept. |
| [IEEE Paper Template](LAB-2/Task-5_IEEE_PAPER/) | A two-column academic paper layout inspired by IEEE formatting. |

### Lab 03 — Bootstrap 5

| Task | Description |
|:--|:--|
| [Bootstrap Lab 2 Redesign](LAB-3/Task-1_BOOTSTRAP_REDO_LAB2/) | Rebuilds the five Lab 2 exercises using Bootstrap's grid and components. |
| [Frostline E-commerce](LAB-3/Task-2_ECOMMERCE_UI/) | A multi-page storefront covering products, cart, accounts, reviews, and checkout. |

### Lab 04 — JavaScript Fundamentals

| Task | Description |
|:--|:--|
| [Biography](LAB-4/task1_biography.js) | Primitive types, variables, and a nested biography object. |
| [Next Prime](LAB-4/task2_next_prime.js) | Finds the next prime number using loops and `let`. |
| [Phone Number Formatter](LAB-4/task3_phone_number.js) | Formats a phone number from an array of digits. |
| [roundMe](LAB-4/task4_roundMe.js) | Implements a variable-argument rounding function. |
| [Absolute, Ceiling and Floor](LAB-4/task5_abs_ceil_floor.js) | Implements multi-argument `abs()`, `ceil()`, and `floor()` functions. |
| [Sum of Multiples](LAB-4/task6_sum_of_multiples.js) | Calculates the sum of multiples of two values below a limit. |

> **Tip:** Open Lab 04 in the portal and use **Compile** to run a supported JavaScript exercise and inspect its console output.

### Lab 05 — Advanced JavaScript

| Task | Description |
|:--|:--|
| [Admission Engine](LAB-5/task1_admission_engine.js) | Evaluates student admission eligibility and merit scores. |
| [Performance Engine](LAB-5/task2_performance_engine.js) | Calculates grades, rankings, and student results. |
| [Profile Update](LAB-5/task3_profile_update.js) | Updates nested student profile data. |
| [User Hierarchy](LAB-5/task4_user_hierarchy.js) | Models people, students, and instructors with classes. |
| [Transcript Modules](LAB-5/task5_transcript_modules/) | Processes student transcripts with reusable JavaScript modules. |
| [Callback Registration](LAB-5/task6_callback_registration.js) | Demonstrates callback-based course registration. |
| [Promise Registration](LAB-5/task7_promise_registration.js) | Demonstrates asynchronous course registration with Promises. |
| [Async Dashboard](LAB-5/task8_async_dashboard.js) | Gathers user and course data for an asynchronous dashboard. |

### Lab 06 — Asynchronous JavaScript

| Task | Description |
|:--|:--|
| [Async User Fetch](LAB-6/task1_async_user_fetch.js) | Fetches and displays user data with async/await. |
| [Promise.all](LAB-6/task2_promise_all.js) | Fetches multiple profiles in parallel with `Promise.all`. |

## Featured Project: Frostline

Frostline is the Lab 03 capstone: a multi-page e-commerce frontend for a winter jacket brand. It demonstrates how individual web development concepts come together to create a cohesive shopping experience.

**Pages**

`Home` · `Shop` · `Product` · `Signup` · `Login` · `Reviews` · `Cart` · `Checkout`

### Storefront features

| Feature | Implementation |
|:--|:--|
| Landing page | Snowy mountain photography with an overlaid hero section. |
| Product catalogue | Eight jackets, live search, category filtering, and sorting. |
| Product details | Size and quantity selection, ratings, and add-to-cart feedback. |
| Shopping cart | Quantity controls, item removal, and automatically updated totals. |
| Discounts | `WINTER10` applies a 10% discount. |
| Shipping | Free shipping on orders over $150. |
| Checkout | Shipping and payment form validation with order confirmation. |
| Accounts | Signup, login, password matching, and a session-aware navbar. |
| Reviews | Average rating, sample reviews, and a form for adding reviews. |

### Try the demo

1. Browse the jacket catalogue.
2. Open a product and add it to your bag.
3. Apply `WINTER10` in the cart.
4. Continue to checkout and complete the demo order.

**Implementation note:** This is a frontend demonstration, not a production commerce system. Cart contents, account-related data, and reviews use browser `localStorage`; there is no backend authentication, payment processing, or persistent server-side database.

## Repository Structure

```text
FSWD-LAB/
├── index.html
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
├── LAB-4/
│   ├── task1_biography.js
│   ├── task2_next_prime.js
│   ├── task3_phone_number.js
│   ├── task4_roundMe.js
│   ├── task5_abs_ceil_floor.js
│   └── task6_sum_of_multiples.js

├── LAB-5/
│   ├── task1_admission_engine.js
│   ├── task2_performance_engine.js
│   ├── task3_profile_update.js
│   ├── task4_user_hierarchy.js
│   ├── task5_transcript_modules/
│   │   ├── Student.js
│   │   ├── gradeUtils.js
│   │   ├── main.js
│   │   ├── package.json
│   │   └── transcriptService.js
│   ├── task6_callback_registration.js
│   ├── task7_promise_registration.js
│   └── task8_async_dashboard.js

├── LAB-6/
│   ├── task1_async_user_fetch.js
│   └── task2_promise_all.js

└── Preview-Portal/
    ├── portal.css
    ├── portal.js
    └── revamp.js
```

## Run Locally

Clone the repository and start a local HTTP server from its root directory.

```bash
git clone https://github.com/codeBilal-exe/FSWD-LAB.git
cd FSWD-LAB
python -m http.server 8000
```

Open `http://localhost:8000` in your browser.

The local server is required for the portal's GitHub API requests. Individual HTML tasks can generally be opened directly, although tasks that rely on browser security restrictions or external resources may require a server too.

## Add a New Lab

1. Create a folder following the `LAB-<number>/Task-<number>_<NAME>/` naming convention.
2. Add the task's HTML, CSS, JavaScript, and assets.
3. Include an `index.html` entry point for browser-based tasks.
4. Commit and push your changes to `main`.

The portal discovers supported tasks automatically, so new task cards do not need to be added manually.

JavaScript-only exercises can be listed as `.js` files and run through the portal when supported by its runner.

## Credits

- [Bootstrap](https://getbootstrap.com/) — responsive layout and UI components.
- [highlight.js](https://highlightjs.org/) — source-code syntax highlighting.
- [Google Fonts](https://fonts.google.com/) — typography.
- [Unsplash](https://unsplash.com/) — product photography used in the storefront demonstration.

---

<div align="center">

**Built lab by lab by [Muhammad Bilal](https://github.com/codeBilal-exe).**

<br>

<img src="favicon.png" alt="" width="40">

<br>

*If you find this project useful, consider giving it a star.*

</div>
