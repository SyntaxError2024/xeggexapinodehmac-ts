import * as XeggeX from "./xApiHmac"

const yourApiKey = null
const yourApiSecret = null

async function main()
{
	if (!yourApiKey || !yourApiSecret) throw "api keys are needed !"

	const api = new XeggeX.xeggexApi(yourApiKey, yourApiSecret)

	let balance = await api.balances()
	console.log(balance)
}

main()


