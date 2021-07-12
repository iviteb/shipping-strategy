import React, { FC, useState } from 'react'
import { useLazyQuery, useQuery } from 'react-apollo'

import ShippingPolicy from './components/ShippingPolicy'
import Warehouse from './components/Warehouse'
import Dock from './components/Dock'
import ShippingRate from './components/ShippingRate'

import GET_SHIPPING_POLICIES from './graphql/shipping.graphql'
import GET_WAREHOUSES from './graphql/warehouse.graphql'
import GET_DOCKS from './graphql/dock.graphql'
import GET_SHIPPING_RATES from './graphql/freight.graphql'
import GET_PROMOTION_BY_ID from './graphql/promotion.graphql'
import GET_PROMOTIONS from './graphql/allPromotions.graphql'

import { 
  Layout, 
  PageBlock, 
  PageHeader,
  Tabs,
  Tab,
  InputButton
} from 'vtex.styleguide'

const ShippingStrategy: FC = () => {

  const [currentTab, setCurrentTab] = useState(1)
  const [currentZipCode, setCurrentZipCode] = useState("0")

  const { data: shippingPolicyData } = useQuery(GET_SHIPPING_POLICIES, { ssr: false })
  const { data: warehouseData} = useQuery(GET_WAREHOUSES, { ssr: false })
  const { data: dockData } = useQuery(GET_DOCKS, { ssr: false })
  const [getShippingRates, { data: shippingRateData }]= useLazyQuery(GET_SHIPPING_RATES)

  const handleRateChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    const zipCode = evt.target.value.trim()

    setCurrentZipCode(zipCode)
  }

  const handleRateSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    getShippingRates({
      variables: {
        carrierId: shippingPolicyData.listAllShippingPolicies.items[0].id,
        zipCode: currentZipCode
      }
    })
  }

  // const { data: promotionData, error: promotionError, loading: promotionLoading } = useQuery(getPromotionById, {
  //   variables: {
  //     promotionId: '8e3fa979-ae73-4184-b064-35b244d658ce'
  //   },
  //   ssr: false
  // })

  // const { data: allPromotionsData, error: allPromotionsError, loading: allPromotionsLoading } = useQuery(getAllPromotions, {
  //   ssr: false
  // })

  return (
    <Layout
      pageHeader={
        <PageHeader title="Seller shipping strategy" />
      }>
      <PageBlock variation="full">
        <Tabs fullWidth>
          <Tab
            label="Shipping Policies"
            active={currentTab === 1}
            onClick={() => setCurrentTab(1)}>
            <ShippingPolicy policies={shippingPolicyData} />
          </Tab>
          <Tab
            label="Warehouses"
            active={currentTab === 2}
            onClick={() => setCurrentTab(2)}>
            <Warehouse warehouses={warehouseData} />
          </Tab>
          <Tab
            label="Docks"
            active={currentTab === 3}
            onClick={() => setCurrentTab(3)}>
            <Dock docks={dockData} />
          </Tab>
          <Tab
            label="Shipping Rates"
            active={currentTab === 4}
            onClick={() => setCurrentTab(4)}>
            <form onSubmit={handleRateSubmit}>
              <InputButton 
                placeholder="Postal code" 
                size="regular" 
                label="Enter postal code" 
                button="Submit" 
                onChange={handleRateChange}
              />
            </form>
            
            {shippingRateData && <ShippingRate rates={shippingRateData} />}
          </Tab>
        </Tabs>
      </PageBlock>
    </Layout>
  )
}

export default ShippingStrategy