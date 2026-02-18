# Recipe App

A simple vanilla JavaScript recipe application built as part of a coding assignment. Features include:

- Recipe cards with title, ingredients, and expandable details.
- Search by title or ingredient with debounced input.
- Sort recipes by title.
- Mark recipes as favorites with a heart button.
- Persist favorites in `localStorage` across page reloads.
- Option to filter to favorites only.
- Dynamic counter showing how many recipes are visible.

## Running Locally

```bash
cd src
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

## Code Structure

- `index.html` – layout and controls
- `styles.css` – basic styling for cards and layout
- `script.js` – contains all application logic inside an IIFE

The application is designed to be clean and easy to read, with meaningful variable names, ES6 syntax, and separation of concerns.