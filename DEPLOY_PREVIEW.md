Preview deployment
------------------

This repository now includes a GitHub Actions workflow that builds the Vite app and deploys the `dist/` folder to GitHub Pages on pushes to `main`.

Preview URL (once the workflow finishes):

https://himashri13.github.io/todo-list/

Notes:
- The action runs automatically after this commit is pushed.
- It may take a minute or two for the Pages site to become available.
- If Pages is not enabled for your repo, enable GitHub Pages in repository settings, source: `gh-pages` branch.
