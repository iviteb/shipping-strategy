import { IOClients } from '@vtex/api'

import ShippingPolicies from './shipping'
import Warehouses from './warehouse'
import Docks from './dock'

export class Clients extends IOClients {
  
  public get shippingPolicy() {
    return this.getOrSet('shippingPolicy', ShippingPolicies)
  }
  
  public get warehouse() {
    return this.getOrSet('warehouse', Warehouses)
  }

  public get dock() {
    return this.getOrSet('dock', Docks)
  }
}