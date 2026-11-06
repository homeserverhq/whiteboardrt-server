# WhiteboardRT Server

WhiteboardRT Server is the self-hosted Socket.IO collaboration server for [WhiteboardRT](https://github.com/homeserverhq/whiteboardrt).

It relays encrypted scene updates, presence, and follow-mode events between clients connected to the same room. It does not persist diagrams; scene and room storage is handled by [WhiteboardRT Storage Backend](https://github.com/homeserverhq/whiteboardrt-storage-backend).

## Provenance

This repository is a modified fork of [excalidraw/excalidraw-room](https://github.com/excalidraw/excalidraw-room), Copyright (c) 2020 Excalidraw, licensed under the MIT License. Upstream git history is preserved for provenance.

WhiteboardRT Server is maintained as an independent repository. It is **not affiliated with or endorsed by Excalidraw**.

## Features

- Room join and presence events (`join-room`, `first-in-room`, `new-user`, `room-user-change`).
- Broadcast and volatile broadcast relay for encrypted scene updates.
- User follow/unfollow mode.
- CORS configuration for self-hosted deployments.
- Compatibility with Socket.IO v4 clients and Engine.IO v3 clients.

## Quick start

### Docker

```bash
docker build -t whiteboardrt-server:latest .
```

```bash
docker run -d --name whiteboardrt-server \
  -p 5000:8080 \
  -e CORS_ORIGIN=https://draw.example.com \
  whiteboardrt-server:latest
```

The server listens on container port `8080` so it can run as a non-root user.

### Docker Compose

```bash
docker compose up -d --build
```

The included Compose file maps host port `5000` to container port `8080`.

### PM2

```bash
pm2 start pm2.production.json
```

## Configuration

The server loads `.env.production` when `NODE_ENV` is not `development`, and `.env.development` otherwise. Environment variables provided by the container or process take precedence.

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Server listening port | `80` production, `3002` development |
| `CORS_ORIGIN` | Allowed browser origin for Socket.IO connections | `*` |
| `NODE_ENV` | Selects the dotenv file and default port | production behavior when unset |

Set `CORS_ORIGIN` to the WhiteboardRT origin in production. The default allows any origin.

## Using with WhiteboardRT

Point the WhiteboardRT web container at this server:

```bash
-e VITE_APP_WS_SERVER_URL=http://whiteboardrt-server:8080
```

The server itself does not need access to Redis or the storage backend.

## Security

The server does not authenticate clients and relays end-to-end encrypted payloads without inspecting them. Run it on a trusted network or behind a reverse proxy, and set `CORS_ORIGIN` to your WhiteboardRT origin.

## Development

```bash
corepack enable
yarn install --frozen-lockfile
yarn start:dev
yarn test
yarn build
```

The development server listens on port `3002` by default.

## Horizontal scaling

The server uses Socket.IO's in-memory adapter. Run a single instance for a given room. For horizontal scaling, configure a shared Socket.IO adapter and sticky sessions. See the [Socket.IO PM2 guidance](https://socket.io/docs/v4/pm2/).

## License and attribution

WhiteboardRT Server includes code from `excalidraw-room`, Copyright (c) 2020 Excalidraw, licensed under the MIT License. See [LICENSE](./LICENSE) and [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

The Excalidraw name and logo are trademarks of their respective owner. This fork does not claim any affiliation with or endorsement by Excalidraw.
