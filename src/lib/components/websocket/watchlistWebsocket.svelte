<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { createWebSocket } from './websocketHelpers';
	import type { WatchlistData } from '$lib/server/watchlist.types';

	let {
		watchlistData = $bindable(),
		watchlistSymbols,
		token
	}: {
		watchlistData: WatchlistData;
		watchlistSymbols: string[];
		token: string;
	} = $props();
	let subscribedSymbols: string[] = [];
	let ws: WebSocket | null = null;

	// Get the difference between the current watchlistSymbols and the subscribedSymbols
	const getDifference = (watchlistSymbols: string[], subscribedSymbols: string[]): string[] => {
		return watchlistSymbols.filter((symbol) => !subscribedSymbols.includes(symbol));
	};

	// Create an array of Trade and Quote subscriptions for each symbol
	const createSubscriptions = (symbols: string[]): Record<string, string>[] => {
		return symbols
			.map((symbol) => {
				return [
					{ type: 'Trade', symbol },
					{ type: 'Quote', symbol }
				];
			})
			.flat();
	};

	// Send subscription to the WebSocket server
	const sendSubscription = (symbols: string[]) => {
		const newSubscriptions = getDifference(symbols, subscribedSymbols);
		if (newSubscriptions.length > 0 && ws?.readyState === 1) {
			ws.send(
				JSON.stringify({
					type: 'FEED_SUBSCRIPTION',
					channel: 3,
					reset: false,
					add: [...createSubscriptions(newSubscriptions)]
				})
			);
			subscribedSymbols = [...subscribedSymbols, ...newSubscriptions];
		}
	};

	$effect(() => {
		sendSubscription(watchlistSymbols);
	});

	const handleWebSocketMessage = (data: string) => {
		// Parse and process the incoming Quote and Trade messages
		if (data.includes('FEED_DATA') && (data.includes('Quote') || data.includes('Trade'))) {
			const message = JSON.parse(data).data;
			const eventType = message[0];
			const messageData = message[1];

			if (eventType === 'Quote') {
				// Every 4 elements in the messageData array is a new message
				for (let i = 0; i < messageData.length; i += 4) {
					const [_, eventSymbol, bidPrice, askPrice] = messageData.slice(i, i + 4);
					if (!watchlistData[eventSymbol]) watchlistData[eventSymbol] = {};

					watchlistData[eventSymbol].bid = bidPrice;
					watchlistData[eventSymbol].ask = askPrice;
				}
			} else if (eventType === 'Trade') {
				// Every 3 elements in the messageData array is a new message
				for (let i = 0; i < messageData.length; i += 3) {
					const [_, eventSymbol, price] = messageData.slice(i, i + 3);
					if (!watchlistData[eventSymbol]) watchlistData[eventSymbol] = {};
					watchlistData[eventSymbol].last = price;
				}
			}
		}
	};

	const handleWebSocketError = (error: Event | Error) => {
		console.error('WebSocket Error:', error);
	};

	const handleWebSocketOpen = () => {
		console.log('WebSocket connection established');
		ws?.send(
			JSON.stringify({
				type: 'SETUP',
				channel: 0,
				version: '0.1-DXF-JS/0.3.0',
				keepaliveTimeout: 60,
				acceptKeepaliveTimeout: 60
			})
		);
		ws?.send(
			JSON.stringify({
				type: 'AUTH',
				channel: 0,
				token
			})
		);
		ws?.send(
			JSON.stringify({
				type: 'CHANNEL_REQUEST',
				channel: 3,
				service: 'FEED',
				parameters: { contract: 'AUTO' }
			})
		);
		ws?.send(
			JSON.stringify({
				type: 'FEED_SETUP',
				channel: 3,
				acceptAggregationPeriod: 0.1,
				acceptDataFormat: 'COMPACT',
				acceptEventFields: {
					Trade: ['eventType', 'eventSymbol', 'price'],
					Quote: ['eventType', 'eventSymbol', 'bidPrice', 'askPrice']
				}
			})
		);
		ws?.send(
			JSON.stringify({
				type: 'FEED_SUBSCRIPTION',
				channel: 3,
				reset: true,
				add: [...createSubscriptions(watchlistSymbols)]
			})
		);

		subscribedSymbols = [...watchlistSymbols];
	};

	const handleWebSocketKeepAlive = () => {
		ws?.send(
			JSON.stringify({
				type: 'KEEPALIVE',
				channel: 0
			})
		);
		ws?.send(
			JSON.stringify({
				type: 'KEEPALIVE',
				channel: 3
			})
		);
	};

	const handleWebSocketClose = (event: CloseEvent) => {
		// Dump watchlistData and subscribedSymbols
		watchlistData = {};
		subscribedSymbols = [];
		console.log('WebSocket closed:', event.reason);
	};

	onDestroy(() => {
		if (ws) {
			ws.close();
			ws = null;
		}
	});

	onMount(() => {
		if (ws) {
			console.warn('WebSocket already initialized. Closing existing connection.');
			ws.close();
			ws = null;
		}

		// Open WebSocket connection
		ws = createWebSocket(
			'wss://tasty-openapi-ws.dxfeed.com/realtime',
			handleWebSocketMessage,
			handleWebSocketError,
			handleWebSocketOpen,
			handleWebSocketClose,
			handleWebSocketKeepAlive
		);
	});
</script>
