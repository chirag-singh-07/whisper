# Socket.io client (website)

A small client helper is available at `src/utils/socket.ts`.

Setup

1. Install the dependency:

```bash
npm install socket.io-client
```

2. Optionally set your API URL in `.env`:

```
VITE_API_URL=http://localhost:3000
```

Usage example

```js
import { initializeSocket } from "./utils/socket";
const socket = initializeSocket(accessToken);
socket.emit('chat:join', { chatId });
socket.emit('message:send', { chatId, text: 'hello' }, (ack) => console.log(ack));
```

Check `src/components/SocketDemo.jsx` for a minimal example.
