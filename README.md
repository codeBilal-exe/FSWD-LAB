# ⚡ Full Stack Web Development (FSWD) Lab Portal

> A dynamic, interactive lab environment and live inspection portal for web development tasks, powered by GitHub Pages and the GitHub REST API.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-10b981?style=for-the-badge&logo=github)](https://codeBilal-exe.github.io/FSWD-LAB/)
[![Stack](https://img.shields.io/badge/Stack-HTML5%20|%20CSS3%20|%20JS-d4af37?style=for-the-badge)](https://developer.mozilla.org/)

---

## ✨ Key Features

- **Automated Lab Discovery:** Scans the repository tree via GitHub API to detect new lab modules and task files automatically—no manual list maintenance required.
- **Interactive Multi-Device Stage:** Preview any task across simulated **Desktop**, **Tablet**, and **Mobile** viewports in real time.
- **Built-in Source Inspector:** Read syntax-highlighted HTML, CSS, and JS files directly in the browser with line numbers and single-click copy functionality.
- **Modern Editorial UI:** Classy dark/light theme with ambient glassmorphism and champagne brass design elements.

---

## 📁 Repository Structure & Naming Conventions

The portal uses GitHub's Git Trees API to discover files. To ensure your work displays properly, follow these conventions:

```text
FSWD-LAB/
├── index.html                    # Main Portal Portal UI
├── favicon.jfif                  # Portal Icon
│
├── LAB-1/                        # Lab Module Folder (Prefix: LAB-*)
│   ├── L1-calculator.html        # Individual Task File
│   ├── L1-calculator-style.css   # Task Stylesheet
│   └── calculato-fun.js          # Task Script
│
└── LAB-2/                        # Multi-Task Folder Structure
    ├── Task-1_TIMETABLE/         # Subfolder per Task
    │   ├── index.html            # Primary Task View
    │   └── style.css
    └── Task-2_FACEBOOK/
        ├── L2-facebook-home.html
        └── L2-facebook-home.css

## Portal Navigation

The portal uses a three-step flow:

1. The home page shows lab cards only.
2. Selecting a lab opens its task cards.
3. Selecting a task opens the live preview and source inspector.

The preview's **Directory** button returns to the task list for the lab you opened. New HTML pages discovered in a `LAB-*` folder automatically become task cards; no card markup needs to be added by hand.
