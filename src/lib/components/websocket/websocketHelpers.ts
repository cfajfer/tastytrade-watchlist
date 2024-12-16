type WebSocketCallback<T = void> = (arg: T) => void;

export const createWebSocket = (
	url: string,
	onMessage?: WebSocketCallback<string>,
	onError?: WebSocketCallback<Event | Error>,
	onOpen?: WebSocketCallback,
	onClose?: WebSocketCallback<CloseEvent>,
	onKeepAlive?: WebSocketCallback
): WebSocket => {
	const ws = new WebSocket(url);

	ws.onopen = () => {
		console.log(`WebSocket connected to ${url}`);
		if (onOpen) onOpen();

		if (onKeepAlive) {
			setInterval(() => {
				onKeepAlive();
			}, 30000);
		}
	};

	ws.onmessage = (event) => {
		if (onMessage) onMessage(event.data);
	};

	ws.onerror = (error) => {
		console.error('WebSocket error:', error);
		if (onError) onError(error);
	};

	ws.onclose = (event) => {
		console.log('WebSocket closed:', event.reason);
		if (onClose) onClose(event);
	};

	return ws;
};
