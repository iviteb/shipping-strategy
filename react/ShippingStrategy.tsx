import React, { FC } from 'react'
import { useQuery } from 'react-apollo'
import ShippingPolicy from './components/ShippingPolicy'
import Warehouse from './components/Warehouse'
import Dock from './components/Dock'
import getAllShippingPolicies from './graphql/shipping.graphql'
import getAllWarehouses from './graphql/warehouse.graphql'
import getAllDocks from './graphql/dock.graphql'

import { 
  Layout, 
  PageBlock, 
  PageHeader
} from 'vtex.styleguide'

const ShippingStrategy: FC = () => {
  const { data } = useQuery(getAllShippingPolicies)
  const { data: warehouseData} = useQuery(getAllWarehouses)
  const { data: dockData } = useQuery(getAllDocks)

  return (
    <Layout
      pageHeader={
        <PageHeader title="Seller shipping strategy" />
      }>
      <PageBlock variation="full">
        <ShippingPolicy policies={data} />
        <div className={`flex mb4`}>
          <div className={`w-50 mr4`}>
            <Warehouse warehouses={warehouseData} />
          </div>
          <div className={`w-50`}>
            <Dock docks={dockData} />
          </div>
        </div>
      </PageBlock>
    </Layout>
  )
}

export default ShippingStrategy