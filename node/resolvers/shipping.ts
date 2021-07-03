export const queries = {
  listAllShippingPolicies: (_: any, __: any, { clients: { shippingPolicy } }: Context) => shippingPolicy.listAllShippingPolicies()
}