import { queries as shippingQueries } from './shipping'
import { queries as warehouseQueries } from './warehouse'
import { queries as dockQueries } from './dock'

export const resolvers = {
  Query: {
    ...shippingQueries,
    ...warehouseQueries,
    ...dockQueries
  }
}