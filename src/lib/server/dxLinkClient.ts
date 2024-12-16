//! DXLink package is not working https://github.com/dxFeed/dxLink/issues/12
// Gets the DXFeed streamer token
export const getDXFeedToken = async (token: string): Promise<string> => {
	const res = await fetch('https://api.cert.tastyworks.com/api-quote-tokens', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token
		}
	});

	const { data } = await res.json();

	return data?.token;
};
