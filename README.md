# FSWD Lab Portal

The project contains the Full Stack Web Development lab exercises and a live preview portal.

- **Live portal:** [codeBilal-exe.github.io/FSWD-LAB](https://codeBilal-exe.github.io/FSWD-LAB/)
- **Main preview file:** [`index.html`](index.html)
- **UI framework:** Bootstrap 5, with small custom styles where needed

## Browse the labs

The portal has three levels:

1. The home page shows one card for each lab.
2. Selecting a lab shows one card for each task.
3. Selecting a task opens its live preview and source inspector.

The portal groups HTML files by task folder. When a task folder contains `index.html`, that page is used for the preview card. Other HTML, CSS, and JavaScript files in the same folder are available in the source inspector, so a multi-page task still has a single preview card.

## Add a new task

Create a folder named `Task-<number>_<NAME>` inside a folder named `LAB-<number>`. Put the task pages and assets together in the task folder:

```text
LAB-3/
  Task-2_ECOMMERCE_UI/
    index.html       # One preview card, opens this page
    shop.html        # Available in the source inspector
    product.html
    signup.html
    login.html
    reviews.html
    cart.html
    checkout.html
    store.css
```

No preview card markup needs to be added manually. Push new files to the configured GitHub branch and the portal will discover them the next time it loads.

For a task stored directly in a lab folder, each HTML file is treated as its own task. A task subfolder with several HTML files is treated as one task; the portal uses `index.html` when available, otherwise it picks the first HTML page it finds.

## Portal configuration

The root `index.html` currently reads the public `codeBilal-exe/FSWD-LAB` repository's `main` branch using the GitHub repository tree API. If the repository or branch changes, update the `REPO` and `BRANCH` constants near the bottom of `index.html`.

Automatic discovery requires a web server and the files to be present on the configured GitHub branch. Browsers cannot list arbitrary folders from a local `file://` page.

## Lab folders

- [Lab 1](LAB-1/)
- [Lab 2](LAB-2/)
- [Lab 3](LAB-3/)
