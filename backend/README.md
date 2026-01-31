# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

---

## Real-time messaging (Socket.io)

We added a simple Socket.io server in `src/utils/socket.ts` to handle:

- Token-based socket authentication (JWT access tokens)
- Join/leave chat rooms (`chat:join` / `chat:leave`)
- Send messages (`message:send`) — messages are persisted and broadcast to the chat room
- Read/delivered acks (`message:read`, `message:delivered`)
- Typing indicators (`typing`)
- User online/offline events (`user:online`, `user:offline`)

How to use from the frontend:

- Install `socket.io-client` in web and mobile clients:

```bash
# website
cd website
npm install socket.io-client

# mobile (expo project)
cd mobile
npm install socket.io-client
```

- In the website (example helper added at `website/src/utils/socket.ts`):

```ts
import { initializeSocket, getSocket } from "./utils/socket";
const socket = initializeSocket(yourAccessToken);
socket.emit("chat:join", { chatId });
socket.emit("message:send", { chatId, text: "hello" }, (ack) => { console.log(ack); });
```

- In mobile, a similar helper is available at `mobile/app/utils/socket.ts`.

Security / production notes:

- Replace `origin: "*"` with your allowed origins and enable HTTPS for production.
- Consider using server-side session validation or token rotation for long-lived connections.
- Implement rate-limiting / abuse prevention if needed.

---

### Uploads

We added an `upload-avatar` endpoint to accept multipart form uploads for user avatars.

- Endpoint: POST `/api/users/upload-avatar`
- Auth: Required (use access token cookie or Authorization header)
- Form field: `avatar` (image/*)
- Saved file path returned as `avatarUrl` (e.g., `/uploads/<filename>`)

Server stores uploads in the top-level `/uploads` folder and serves files statically from `/uploads`.

Notes:
- File size limit: 5 MB
- Only image mime-types are accepted
- Add `multer` to dependencies and run `bun install` or `npm install` as needed

