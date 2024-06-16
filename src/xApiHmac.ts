import { createHmac } from "crypto"

const baseUrl = 'https://api.xeggex.com/api/v2';


export class XeggexAPI {

	apiKey: string
	apiSecret: string
	baseUrl: string

	constructor(apiKey: string, apiSecret: string) {
		this.apiKey = apiKey
		this.apiSecret = apiSecret
		this.baseUrl = baseUrl
	}

	signature(requestUrl: string, requestBodyString: any) {
		if (!requestBodyString) {
			requestBodyString = "";
		}

		let data = this.apiKey + requestUrl + requestBodyString + Date.now().toString()

		return createHmac('sha256', this.apiSecret).update(data).digest("hex")
	}

	getQuery(url: URL): Promise<any> {
		let nonce = Date.now();
		let apiKey = this.apiKey;
		let signature = this.signature(url.href, null);

		return fetch(url.href, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-API-KEY': apiKey,
				'X-API-NONCE': nonce.toString(),
				'X-API-SIGN': signature
			}
		})
			.then(res => res.json())

	}

	postQuery(url: URL, body: any): Promise<any> {

		let nonce = Date.now();
		let apiKey = this.apiKey;
		let signature = this.signature(url.href, JSON.stringify(body))

		return fetch(url.href, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-KEY': apiKey,
				'X-API-NONCE': nonce.toString(),
				'X-API-SIGN': signature
			},
			body: JSON.stringify(body)
		})
			.then(res => res.text())

	}

	// Public API

	assetGetList() {
		let url = new URL(this.baseUrl + '/asset/getlist');
		return this.getQuery(url);
	}

	assetGetById(assetId: string) {
		let url = new URL(this.baseUrl + '/asset/getbyid/' + assetId);
		return this.getQuery(url);
	}

	assetGetByTicker(ticker: string) {
		let url = new URL(this.baseUrl + '/asset/getbyticker/' + ticker);
		return this.getQuery(url);
	}

	marketGetList() {
		let url = new URL(this.baseUrl + '/market/getlist');
		return this.getQuery(url);
	}

	marketGetById(marketId) {
		let url = new URL(this.baseUrl + '/market/getbyid/' + marketId);
		return this.getQuery(url);
	}

	marketGetBySymbol(symbol) {
		let url = new URL(this.baseUrl + '/market/getbysymbol/' + symbol);
		return this.getQuery(url);
	}

	poolGetList() {
		let url = new URL(this.baseUrl + '/pool/getlist');
		return this.getQuery(url);
	}

	poolGetById(poolId) {
		let url = new URL(this.baseUrl + '/pool/getbyid/' + poolId);
		return this.getQuery(url);
	}

	poolGetBySymbol(symbol) {
		let url = new URL(this.baseUrl + '/pool/getbysymbol/' + symbol);
		return this.getQuery(url);
	}

	marketOrderBookBySymbol(symbol) {
		let url = new URL(this.baseUrl + '/market/getorderbookbysymbol/' + symbol);
		return this.getQuery(url);
	}

	marketOrderBookByMarketId(marketId) {
		let url = new URL(this.baseUrl + '/market/getorderbookbymarketid/' + marketId);
		return this.getQuery(url);
	}

	// Nomics Datafeed Format

	getInfo(): Promise<Xeggex.Infos> {
		let url = new URL(this.baseUrl + '/info');
		return this.getQuery(url);
	}

	getMarkets() {
		let url = new URL(this.baseUrl + '/markets');
		return this.getQuery(url);
	}

	getTrades(marketId, since = null) {
		let url = new URL(this.baseUrl + '/trades');

		let params: any =
		{
			market: marketId
		}

		if (since) params.since = since

		url.search = new URLSearchParams(params).toString();
		return this.getQuery(url);
	}

	getOrdersSnapshot(marketId:string) {
		let url = new URL(this.baseUrl + '/orders/snapshot');
		let params = {
			market: marketId,
		};
		url.search = new URLSearchParams(params).toString();
		return this.getQuery(url);
	}

	// CoinGecko Datafeed Format

	getPairs() {
		let url = new URL(this.baseUrl + '/pairs');
		return this.getQuery(url);
	}

	getTickers() {
		let url = new URL(this.baseUrl + '/tickers');
		return this.getQuery(url);
	}

	getOrderBook(tickerId, depth = 100) {
		let url = new URL(this.baseUrl + '/orderbook');
		let params = {
			ticker_id: tickerId,
			depth: depth
		};
		url.search = new URLSearchParams(params as any).toString();
		return this.getQuery(url);
	}

	getHistoricalSpotTrades(tickerId, limit = 100) {
		let url = new URL(this.baseUrl + '/historical_trades');
		let params = {
			ticker_id: tickerId,
			limit: limit
		};
		url.search = new URLSearchParams(params as any).toString();
		return this.getQuery(url);
	}

	getHistoricalPoolTrades(tickerId, limit = 100) {
		let url = new URL(this.baseUrl + '/historical_pooltrades');
		let params = {
			ticker_id: tickerId,
			limit: limit
		};
		url.search = new URLSearchParams(params as any).toString();
		return this.getQuery(url);
	}

	// Private API

	balances(): Promise<Xeggex.Balance[]> {
		let url = new URL(this.baseUrl + '/balances');
		return this.getQuery(url);
	}

	createOrder(symbol, side: Xeggex.Side, quantity, price, type: Xeggex.Type = 'limit', userProvidedId = null, strictValidate = false) {
		let url = new URL(this.baseUrl + '/createorder');
		let body = {
			"userProvidedId": userProvidedId,
			"symbol": symbol,
			"side": side,
			"type": type,
			"quantity": quantity,
			"price": price,
			"strictValidate": strictValidate,
		};
		return this.postQuery(url, body);
	}

	cancelOrder(orderId: string) {
		let url = new URL(this.baseUrl + '/cancelorder');
		let body = {
			"id": orderId,
		};
		return this.postQuery(url, body);
	}

	cancelAllOrders(symbol, side = 'all') {
		let url = new URL(this.baseUrl + '/cancelallorders');
		let body = {
			"symbol": symbol,
			"side": side,
		};
		return this.postQuery(url, body);
	}

	/** @function getMyOrders
	 *
	 * Get a list of your spot market orders
	 */

	getMyOrders(symbol = null, // formatted like DOGE/BTC
		status: Xeggex.Status = "active",
		limit = 100,
		skip = 0): Promise<Xeggex.Order[]> {
		let url = new URL(this.baseUrl + '/getorders')

		let params = {
			symbol: symbol,
			status: status,
			limit: limit,
			skip: skip,
		}

		url.search = new URLSearchParams(params as any).toString()

		return this.getQuery(url);
	}

	getMyTrades(symbol = null, limit = 100, skip = 0) {
		let url = new URL(this.baseUrl + '/gettrades');
		let params = {
			symbol: symbol,
			limit: limit,
			skip: skip,
		};
		url.search = new URLSearchParams(params as any).toString();
		return this.getQuery(url);
	}

	getMyTradesSince(symbol = null, since = 0, limit = 100, skip = 0) {
		let url = new URL(this.baseUrl + '/gettradessince');
		let params = {
			symbol: symbol,
			since: since,
			limit: limit,
			skip: skip,
		};
		url.search = new URLSearchParams(params as any).toString();
		return this.getQuery(url);
	}

	getMyPoolTrades(symbol = null, limit = 100, skip = 0) {
		let url = new URL(this.baseUrl + '/getpooltrades');
		let params = {
			symbol: symbol,
			limit: limit,
			skip: skip,
		};
		url.search = new URLSearchParams(params as any).toString();
		return this.getQuery(url);
	}

	getMyPoolTradesSince(symbol = null, since = 0, limit = 100, skip = 0) {
		let url = new URL(this.baseUrl + '/getpooltradessince');
		let params = {
			symbol: symbol,
			since: since,
			limit: limit,
			skip: skip,
		};
		url.search = new URLSearchParams(params as any).toString();
		return this.getQuery(url);
	}
}
