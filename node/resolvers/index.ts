import { 
  queries as shippingQueries,
  mutations as shippingMutations
} from './shipping'
import { queries as warehouseQueries } from './warehouse'
import { queries as dockQueries } from './dock'
import { 
  queries as freightQueries,
  mutations as freightMutations
} from './freight'
import { 
  queries as promotionQueries,
  mutations as promotionMutations
} from './promotion'

export const resolvers = {
  Query: {
    ...shippingQueries,
    ...warehouseQueries,
    ...dockQueries,
    ...freightQueries,
    ...promotionQueries
  },
  Mutation: {
    ...shippingMutations,
    ...freightMutations,
    ...promotionMutations
  }
}