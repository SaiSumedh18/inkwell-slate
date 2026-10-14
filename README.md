# Inkwell Slate

An Apple-style landing page for Inkwell Slate, a made-up e-ink notebook.
Built with Next.js, TypeScript, Tailwind CSS and Framer Motion.

**Live site:** https://saisumedh18.github.io/my-website/

## Run it on your computer

You need [Node.js](https://nodejs.org) 24 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The page reloads as you edit files in `src/`.

To view it on your phone while it runs, connect the phone to the same Wi-Fi
and open `http://<your-computer's-IP>:3000`.

## Other commands

| Command         | What it does                              |
| --------------- | ----------------------------------------- |
| `npm run build` | Builds the production version             |
| `npm start`     | Serves the production build on port 3000  |
| `npm run lint`  | Checks the code for problems              |

## Deployment

Every push to `main` builds a static version of the site and publishes it to
GitHub Pages (see `.github/workflows/deploy.yml`).
