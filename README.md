# **tastytrade-watchlist**

## Getting Started

Follow these steps to set up and run the project on your local machine:

### Development

Once you've installed the dependencies with `npm install` start a development server:

```bash
npm run dev
```

### Production

To create a production build run:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## **Features**

### Login

- Login functionality through tastytrade.

### Watchlists

- Create, view, and delete watchlists.
- Add or remove symbols from watchlists.
- View bid, ask, and last price information in real-time.

![Watchlist Feature](https://i.gyazo.com/d2163e71e32f97fccdce4b4c42ed06d3.gif)

### Charting

- Five days historical and real-time 1 minute data.
- TradingView style candlestick charting.

![Chart Feature](https://i.gyazo.com/d2fd1f4bfa5bcba7c3d5cdb11bace243.gif)

## **Notable Issues**

## DXFeed SDK

- DXLink package does not work: https://github.com/dxFeed/dxLink/issues/12.

## tastytrade SDK

- symbolSearchService.getSymbolData() method returns 503 Service Unavailable error.
