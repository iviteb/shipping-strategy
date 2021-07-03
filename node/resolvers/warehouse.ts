export const queries = {
  listAllWarehouses: (_: any, __: any, { clients: { warehouse } }: Context) => warehouse.listAllWarehouses()
}