# Socket.io client (mobile)

A small client helper is available at `app/utils/socket.ts`.

Setup

1. Install the dependency:

```bash
npm install socket.io-client
```

2. Optionally set your API URL in your environment variables (Expo uses `EXPO_PUBLIC_*` prefix):

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Usage example

```ts
import { initializeSocket } from "../utils/socket";
const socket = initializeSocket(accessToken);
socket.emit('chat:join', { chatId });
socket.emit('message:send', { chatId, text: 'hello' }, (ack) => console.log(ack));
```

Check `app/components/SocketDemo.tsx` for a minimal example.
