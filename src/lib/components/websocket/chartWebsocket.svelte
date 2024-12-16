<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { createWebSocket } from './websocketHelpers';
	import { ColorType, CrosshairMode, type CandlestickData, type Time } from 'lightweight-charts';
	import { Chart, CandlestickSeries } from 'svelte-lightweight-charts';
	import { Button } from 'flowbite-svelte';

	let {
		token,
		page = $bindable(),
		selectedSymbol = $bindable()
	}: {
		token: string;
		page: string;
		selectedSymbol: string;
	} = $props();

	let ws: WebSocket;

	let candleData = $state<CandlestickData<Time>[]>([]);
	let lastPrice = $state<number>(0);

	const options = {
		width: 900,
		height: 600,
		layout: {
			textColor: 'rgba(150, 150, 150, 0.9)',
			background: { type: ColorType.Solid, color: 'rgb(255, 255, 255)' }
		},
		grid: {
			vertLines: {
				color: 'rgba(197, 203, 206, 0.5)'
			},
			horzLines: {
				color: 'rgba(197, 203, 206, 0.5)'
			}
		},
		crosshair: {
			mode: CrosshairMode.Normal
		},
		rightPriceScale: {
			borderColor: 'rgba(150, 150, 150, 0.9)'
		},
		timeScale: {
			borderColor: 'rgba(150, 150, 150, 0.9)',
			timeVisible: true
		}
	};

	const goBack = () => {
		selectedSymbol = '';
		page = 'watchlist';
	};

	const handleWebSocketMessage = (data: string) => {
		// Parse and process the incoming Candle and Trade messages
		if (data.includes('FEED_DATA') && (data.includes('Candle') || data.includes('Trade'))) {
			const message = JSON.parse(data).data;
			const eventType = message[0];
			const messageData = message[1];
			if (eventType === 'Candle') {
				const updatedCandles: typeof candleData = [...candleData];

				// Every 8 elements in the messageData array is a new message
				for (let i = 0; i < messageData.length; i += 8) {
					const [_eventType, _eventSymbol, _eventTime, time, open, high, low, close] =
						messageData.slice(i, i + 8);

					const newCandle = {
						time: Math.floor(new Date(time).getTime() / 1000) as Time,
						open: Number(open),
						high: Number(high),
						low: Number(low),
						close: Number(close)
					};

					// If this candle already exists, update it
					const lastCandle = updatedCandles[updatedCandles.length - 1];
					if (lastCandle?.time === newCandle.time) {
						updatedCandles[updatedCandles.length - 1] = {
							...lastCandle,
							...newCandle
						};
					} else {
						// Otherwise, add the new candle
						updatedCandles.push(newCandle);
					}
				}

				// Sort candles ascending by time
				updatedCandles.sort((a, b) => Number(a.time) - Number(b.time));

				candleData = updatedCandles;
			}
			if (eventType === 'Trade') {
				// Every 3 elements in the messageData array is a new message
				for (let i = 0; i < messageData.length; i += 3) {
					const [_eventType, _eventSymbol, price] = messageData.slice(i, i + 3);
					lastPrice = price;
				}
			}
		}
	};

	const handleWebSocketError = (error: Event | Error) => {
		console.error('WebSocket Error:', error);
	};

	const handleWebSocketOpen = () => {
		console.log('WebSocket connection established');
		ws.send(
			JSON.stringify({
				type: 'SETUP',
				channel: 0,
				version: '0.1-DXF-JS/0.3.0',
				keepaliveTimeout: 60,
				acceptKeepaliveTimeout: 60
			})
		);
		ws.send(
			JSON.stringify({
				type: 'AUTH',
				channel: 0,
				token
			})
		);
		ws.send(
			JSON.stringify({
				type: 'CHANNEL_REQUEST',
				channel: 1,
				service: 'FEED',
				parameters: { contract: 'AUTO' }
			})
		);
		ws.send(
			JSON.stringify({
				type: 'FEED_SETUP',
				channel: 1,
				acceptAggregationPeriod: 0.1,
				acceptDataFormat: 'COMPACT',
				acceptEventFields: {
					Trade: ['eventType', 'eventSymbol', 'price'],
					Candle: ['eventType', 'eventSymbol', 'eventTime', 'time', 'open', 'high', 'low', 'close']
				}
			})
		);
		ws.send(
			JSON.stringify({
				type: 'FEED_SUBSCRIPTION',
				channel: 1,
				reset: true,
				add: [
					{ type: 'Trade', symbol: selectedSymbol },
					{
						type: 'Candle',
						symbol: `${selectedSymbol}{=1m}`,
						fromTime: new Date().getTime() - 1000 * 60 * 60 * 24 * 5
					}
				]
			})
		);
	};

	const handleWebScoketKeepAlive = () => {
		ws.send(
			JSON.stringify({
				type: 'KEEPALIVE',
				channel: 0
			})
		);
		ws.send(
			JSON.stringify({
				type: 'KEEPALIVE',
				channel: 1
			})
		);
	};

	const handleWebSocketClose = (event: CloseEvent) => {
		console.log('WebSocket closed:', event.reason);
	};

	onDestroy(() => {
		if (ws) ws.close();
	});

	onMount(() => {
		// Open WebSocket connection
		ws = createWebSocket(
			'wss://tasty-openapi-ws.dxfeed.com/realtime',
			handleWebSocketMessage,
			handleWebSocketError,
			handleWebSocketOpen,
			handleWebSocketClose,
			handleWebScoketKeepAlive
		);
	});
</script>

<main class="flex min-h-screen flex-col items-center p-4">
	<!-- Back Button -->
	<div class="mb-4 flex items-center justify-center gap-2 self-start text-gray-800">
		<Button
			class="flex items-center justify-center rounded-full bg-gray-500 p-2 shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			on:click={goBack}
			size="sm"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="h-5 w-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg></Button
		> Back to Watchlist
	</div>

	<!-- Title -->
	<h1 class="mb-2 text-2xl font-semibold text-gray-800">{selectedSymbol}</h1>

	<!-- Price Display -->
	<p class="mb-6 text-lg text-gray-600">
		Last:
		<span class="font-bold">${lastPrice}</span>
	</p>

	<!-- Chart Container -->
	<Chart
		container={{ class: 'h-[28rem] w-full max-w-5xl rounded-lg bg-white p-4 shadow-md' }}
		autoSize={true}
		{...options}
	>
		<CandlestickSeries
			reactive={true}
			data={candleData}
			title={selectedSymbol}
			priceLineVisible={true}
			upColor="#26a69a"
			downColor="#ef5350"
			wickUpColor="#26a69a"
			wickDownColor="#ef5350"
		/>
	</Chart>
</main>
