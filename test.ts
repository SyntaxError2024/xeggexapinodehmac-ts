import * as XeggeX from "./xApiHmac"

const yourApiKey = null
const yourApiSecret = null

async function main()
{
	if (!yourApiKey || !yourApiSecret) throw "api keys are needed !"

	const api = new XeggeX.xeggexApi(yourApiKey, yourApiSecret)

	let balances = await api.balances()
	
	for (let asset of balances)
	{
		if (parseInt(asset.held))
		{
			console.log(`${asset.asset} (${asset.name} held ${asset.held} available ${asset.available} pending ${asset.pending}`)
		}
	}
}

main()


