type floatAsString=string

declare namespace XeggexAPI
{
	enum Type
	{
		"buy",
		"sell"
	}

	interface Balance
	{
		/*** short name */
		asset: string //"URSA"
		/*** long name */
		name: string // "Ursula"
		/*** tradable */
		available: floatAsString
		/*** ??? */
		pending:floatAsString
		held:floatAsString
		assetid:string
	}

	/*** getMyTrades */

	interface Trade
	{
		id: string
		market:
		{
			id: string
			symbol: string // "XPE/USDT"
		},
		orderid: string
		side: Type
		triggeredBy: Type
		price: floatAsString
		quantity: floatAsString
		fee: floatAsString
		totalWithFee: floatAsString
		alternateFeeAsset: string
		alternateFee: floatAsString
		createdAt: EpochTimeStamp
		updatedAt: EpochTimeStamp
	}

	/*** getInfo() */

	interface Infos
	{
		name: string // "Xeggex",
		description: string // "Xeggex.com is a no kyc required centralized exchange based out of Seychelles.  Xeggex specializes in low to medium market capitalization cryptocurrency assets.  We focus our attention on keeping deposits, withdrawals, and trades working as fast, efficient, and secure as possible. Xeggex also offers users the ability to make liquidity pools between any asset we have listed on the platform. Liquidity Pools work similar to how pools work on DEX platforms such as Pancakeswap and Uniswap. The difference with Xeggex is that any assets we have listed can be paired together without having to wrap any assets to another blockchain. Also, since the add and remove liquidity functions do not require an on chain transaction fee, the cost of these actions are zero.  Xeggex also offers some of the industries lowest withdraw fee rates, which are based on actual network cost and are not designed for profit. Xeggex supports many different types of blockchains and tokenized assets and we continues to add more every week.",
		location: string // "Germany",
		logo: string // "https://xeggex.com/images/xeggex-token-256.png",
		website: string // "https://xeggex.com",
		twitter: string // "xeggex",
		version: string // "1.0",
		capability:
		{
			markets: boolean // true,
			trades: boolean // true,
			ordersSnapshot: boolean // true,
			candles: boolean // false,
			ticker: boolean // false
		}
	}
}
