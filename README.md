# Inkwell Slate

A store site for Inkwell Slate, a made-up e-ink notebook. It has a scroll-driven hero, paper
templates, a pen picker with a drawing pad, a product configurator, a bag, and a checkout backed
by a real orders API.

Built with Next.js, TypeScript, Tailwind CSS and Framer Motion. Hosted on Vercel.

## Run it on your computer

You need [Node.js](https://nodejs.org) 24 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Orders you place locally are saved to `.data/store.json`.

To try the orders dashboard locally, create `.env.local` with a password (see `.env.example`):

```bash
ADMIN_PASSWORD=choose-a-password
```

then open http://localhost:3000/admin.

## Pages

| Page        | What it does                                                    |
| ----------- | --------------------------------------------------------------- |
| `/`         | Product page, configurator and bag                              |
| `/checkout` | Delivery details and order placement                            |
| `/orders`   | Look up an order with its number and email                      |
| `/admin`    | Password-protected list of all orders with totals               |

## API

| Endpoint                 | Purpose                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `POST /api/orders`       | Validates the order, recalculates prices on the server, saves it        |
| `GET /api/orders`        | Returns one order when `number` and `email` both match                  |
| `GET /api/admin/orders`  | Lists orders; needs `Authorization: Bearer <ADMIN_PASSWORD>`            |

## Deploying to Vercel

1. Import this repository in Vercel.
2. In the project's **Storage** tab, connect an **Upstash for Redis** database. This adds the
   `KV_REST_API_URL` and `KV_REST_API_TOKEN` environment variables.
3. In **Settings → Environment Variables**, add `ADMIN_PASSWORD`.
4. Redeploy. Every push to `main` deploys automatically after that.

This is a demo store: no payment is taken and nothing ships.

## Other commands

| Command         | What it does                             |
| --------------- | ---------------------------------------- |
| `npm run build` | Builds the production version            |
| `npm start`     | Serves the production build on port 3000 |
| `npm run lint`  | Checks the code for problems             |
