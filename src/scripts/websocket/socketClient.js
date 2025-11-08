class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.currentUserId = null; // 🆕 Para filtrar posts propios
  }

  connect(token, userId) { // 🆕 Recibe userId
    const WS_URL = import.meta.env.PUBLIC_WS_URL || 'http://localhost:3000';
    this.currentUserId = userId; // 🆕 Guarda el userId
    
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

      // 🆕 LISTENER PARA POST CREADO
      this.socket.on('post-created', (data) => {
        // Filtrar si el post es del usuario actual
        if (data.authorId !== this.currentUserId) {
          console.log('📬 Nuevo post recibido:', data.post);
          this.emit('post-created', data);
        } else {
          console.log('🚫 Post propio ignorado (ya está en el feed)');
        }
      });

      // Listeners de eventos existentes
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

  off(event, callback) { // 🆕 Para eliminar listeners
    if (!this.listeners.has(event)) return;
    
    if (callback) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    } else {
      this.listeners.delete(event);
    }
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
      this.listeners.clear(); // 🆕 Limpia listeners
    }
  }
}

// Si no hay Socket.IO, usar un mock
const socketClient = typeof io !== 'undefined' 
  ? new SocketClient() 
  : {
      connect: () => console.warn('Socket.IO no disponible'),
      on: () => {},
      off: () => {},
      emit: () => {},
      likePost: () => {},
      addComment: () => {},
      disconnect: () => {}
    };

export default socketClient;