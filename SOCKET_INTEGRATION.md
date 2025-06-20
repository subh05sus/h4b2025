# Socket Integration Guide

## Overview

This project now includes socket integration that allows the avatar to receive and respond to `AVATAR_TALK` messages in real-time.

## Features

- **Real-time Socket Communication**: Connects to a WebSocket server to receive messages
- **Avatar Speech Integration**: Automatically makes the avatar speak when `AVATAR_TALK` messages are received  
- **Glass Morphism Message Dialog**: Beautiful dialog at bottom center showing current messages and history
- **Message History**: View all received messages with timestamps and types
- **Connection Status**: Visual indicator showing socket connection status

## Usage

### 1. Start the Test Socket Server
```bash
npm run socket-server
```
This starts a test server on port 3001 that sends periodic `AVATAR_TALK` messages.

### 2. Start the Next.js Application
```bash
npm run dev
```

### 3. Expected Message Format
The socket expects messages in this format:
```json
{
  "type": "AVATAR_TALK",
  "text": "Here's what your function is doing wrong..."
}
```

## Components

### useSocket Hook (`hooks/useSocket.ts`)
- Manages WebSocket connection with auto-reconnection
- Handles incoming messages and filters `AVATAR_TALK` types
- Maintains message history
- Provides connection status

### MessageDialog Component (`components/MessageDialog.tsx`)
- Glass morphism design for beautiful UI
- Shows current message being spoken
- Message history with timestamps
- Minimizable and closable
- Real-time connection indicator

### Updated AvatarView Component
- Integrated socket functionality
- Automatic speech triggering for `AVATAR_TALK` messages
- Message dialog integration

## Configuration

### Default Socket Server URL
```typescript
const { socket, isConnected, messages, currentMessage } = useSocket('ws://localhost:3001');
```

You can change the server URL by passing a different parameter to the `useSocket` hook.

### Test Server Features
- Sends welcome message on connection
- Periodic `AVATAR_TALK` messages every 10 seconds
- Responds to custom `request_message` events
- Handles multiple client connections

## Message Types

The system supports different message types with color coding:
- `AVATAR_TALK` - Green (triggers speech)
- `ERROR` - Red
- `WARNING` - Yellow
- Others - Blue

## Customization

### Styling
The MessageDialog uses Tailwind CSS with custom glass morphism effects. You can customize:
- Background blur and opacity
- Border colors and effects
- Animation timing
- Size and positioning

### Socket Events
Add new event handlers in the `useSocket` hook:
```typescript
socketInstance.on('custom_event', handleCustomEvent);
```

### Message Processing
Extend message handling in the `handleMessage` function to support additional message types.
