export const queries = {
  listAllDocks: (_: any, __: any, { clients: { dock } }: Context) => dock.listAllDocks()
}