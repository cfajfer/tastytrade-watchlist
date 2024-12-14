import TastytradeClient from '@tastytrade/api';

export const tastytradeApi = new TastytradeClient({
	baseUrl: 'https://api.cert.tastyworks.com',
	accountStreamerUrl: 'https://streamer.cert.tastyworks.com'
});
