namespace XeggexAPI
{
	interface Balance
	{
		/*** short name */
		asset: string //"URSA"
		/*** long name */
		name: string // "Ursula"
		/*** tradable */
		available: string //  "0.00000000",
		/*** ??? */
		pending:string // "0.00000000",
		held:string // "0.00000000",
		assetid:string // "65e05b68759ce56c488d076c"
	}
}
