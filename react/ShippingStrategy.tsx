import React, { FC, useState } from 'react'
import { useLazyQuery, useQuery, useMutation } from 'react-apollo'

import ShippingPolicy from './components/ShippingPolicy'
import Warehouse from './components/Warehouse'
import Dock from './components/Dock'
import ShippingRate from './components/ShippingRate'

import GET_SHIPPING_POLICIES from './graphql/shipping.graphql'
import GET_WAREHOUSES from './graphql/warehouse.graphql'
import GET_DOCKS from './graphql/dock.graphql'
import GET_SHIPPING_RATES from './graphql/freight.graphql'
import GET_PROMOTIONS from './graphql/allPromotions.graphql'
import CREATE_OR_UPDATE_PROMOTION from './graphql/createOrUpdatePromotion.graphql'

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
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(0)

  const { data: shippingPolicyData } = useQuery(GET_SHIPPING_POLICIES, { ssr: false })
  const { data: warehouseData} = useQuery(GET_WAREHOUSES, { ssr: false })
  const { data: dockData } = useQuery(GET_DOCKS, { ssr: false })
  const { data: allPromotionsData } = useQuery(GET_PROMOTIONS, { ssr: false })

  let filteredPromotion: any = []
  if (allPromotionsData?.listAllPromotions?.items?.length) {
    filteredPromotion = allPromotionsData.listAllPromotions.items.filter((item: any) => item.name === "Free delivery" && item.isActive === true)
  }

  const [createOrUpdatePromotion] = useMutation(CREATE_OR_UPDATE_PROMOTION, {
    refetchQueries: [
      { query: GET_PROMOTIONS } 
    ]
  })

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

    setCurrentZipCode("0")
  }

  const handlePromotionChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    const threshold = Number(evt.target.value)

    setFreeDeliveryThreshold(threshold)
  }

  console.log(freeDeliveryThreshold, filteredPromotion)

  const handlePromotionSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    createOrUpdatePromotion({
      variables: {
        newTotalValueCeling: freeDeliveryThreshold,
        promotionId: filteredPromotion[0].idCalculatorConfiguration
      }
    })

    setFreeDeliveryThreshold(0)
  }

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
            
            {shippingRateData && <ShippingRate rates={shippingRateData} searchZipCode={currentZipCode} carrierId={shippingPolicyData.listAllShippingPolicies.items[0].id} />}
          </Tab>
          <Tab
            label="Promotions"
            active={currentTab === 5}
            onClick={() => setCurrentTab(5)}>
            <form onSubmit={handlePromotionSubmit}>
              <InputButton 
                placeholder="Free delivery threshold" 
                size="regular" 
                label="Enter free delivery threshold" 
                button="Submit" 
                onChange={handlePromotionChange}
              />
            </form>
          </Tab>
        </Tabs>
      </PageBlock>
    </Layout>
  )
}

export default ShippingStrategy