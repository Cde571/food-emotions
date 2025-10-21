class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    const WS_URL = import.meta.env.PUBLIC_WS_URL || 'http://localhost:3000';
    
    try {
      this.socket = io(WS_URL, {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts
      });

      this.socket.on('connect', () => {
        console.log('✅ WebSocket conectado');
        this.reconnectAttempts = 0;
      });

      this.socket.on('disconnect', () => {
        console.log('🔴 WebSocket desconectado');
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Error de conexión WebSocket:', error);
        this.reconnectAttempts++;
      });

      // Listeners de eventos
      this.socket.on('post-liked', (data) => {
        this.emit('post-liked', data);
      });

      this.socket.on('comment-added', (data) => {
        this.emit('comment-added', data);
      });

      this.socket.on('notification', (data) => {
        this.emit('notification', data);
      });

      this.socket.on('message-received', (data) => {
        this.emit('message-received', data);
      });

    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  likePost(postId, authorId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('like-post', { postId, authorId });
    }
  }

  addComment(postId, text) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('add-comment', { postId, text });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Si no hay Socket.IO, usar un mock
const socketClient = typeof io !== 'undefined' 
  ? new SocketClient() 
  : {
      connect: () => console.warn('Socket.IO no disponible'),
      on: () => {},
      emit: () => {},
      likePost: () => {},
      addComment: () => {},
      disconnect: () => {}
    };

export default socketClient;