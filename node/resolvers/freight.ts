export const queries = {
  listShippingRate: (_: any, { carrierId, zipCode }: any, { clients: { shippingRate } }: Context) => shippingRate.listShippingRate(carrierId, zipCode),
}

export const mutations = { 
  updateShippingRate: async (_: any, args: any, { clients: { shippingRate } }: Context) => {
    const data = args.input
    console.log(data)
    return shippingRate.updateShippingRate(args.carrierId, data)
  }
}