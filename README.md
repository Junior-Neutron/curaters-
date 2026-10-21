# Curaters — Static Frontend Demo

This repository version contains the Curaters client interface only. The Node/Express server, API routes, database schema/migrations, authentication services, and storage integrations have been removed.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

To create the static site bundle:

```bash
npm run build
```

The output is written to `dist/` and can be hosted on a static host such as GitHub Pages. Vite is configured with relative asset paths for project-site hosting.

## Privacy and limitations

- No backend or database is included.
- No account sign-in is available.
- The trip form validates in the browser only. Submitting it does not send or save the entered details; refreshing/leaving the page clears them.
- The site is a visual/interaction demo. Booking requests, authentication, and server-dependent features will not work until separately connected to a service.
