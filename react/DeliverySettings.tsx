import React, { FC, useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from 'react-apollo'
import { useIntl } from 'react-intl'

import ShippingPolicy from './components/ShippingPolicy'
import Warehouse from './components/Warehouse'
import Dock from './components/Dock'
import ShippingRate from './components/ShippingRate'
import Promotion from './components/Promotion'

import GET_SHIPPING_POLICIES from './graphql/shipping.graphql'
import GET_WAREHOUSES from './graphql/warehouse.graphql'
import GET_DOCKS from './graphql/dock.graphql'
import GET_SHIPPING_RATES from './graphql/freight.graphql'
import GET_PROMOTIONS from './graphql/allPromotions.graphql'
import GET_PROMOTION_BY_ID from './graphql/promotion.graphql'

import { 
  Layout, 
  PageBlock, 
  PageHeader,
  Tabs,
  Tab,
  ToastProvider
} from 'vtex.styleguide'

const DeliverySettings: FC = () => {

  const [currentTab, setCurrentTab] = useState(1)
  const [idCalculatorConfiguration, setIdCalculatorConfiguration] = useState("")
  const intl = useIntl()

  const { data: shippingPolicyData } = useQuery(GET_SHIPPING_POLICIES, { ssr: false })
  const { data: warehouseData} = useQuery(GET_WAREHOUSES, { ssr: false })
  const { data: dockData } = useQuery(GET_DOCKS, { ssr: false })
  const { data: allPromotionsData } = useQuery(GET_PROMOTIONS, { ssr: false })
  
  let filteredPromotion: any = []
  useEffect(() => {
    if (allPromotionsData?.listAllPromotions?.items?.length) {
      filteredPromotion = allPromotionsData.listAllPromotions.items.filter((item: any) => item.name === "Free delivery")
      setIdCalculatorConfiguration(filteredPromotion[0].idCalculatorConfiguration)
    }
  }, [allPromotionsData])

  const [getPromotionData, { data: promotionData }] = useLazyQuery(GET_PROMOTION_BY_ID)
  const [getShippingRates, { data: shippingRateData }]= useLazyQuery(GET_SHIPPING_RATES)

  const handleRateTabChange = () => {
    getShippingRates({
      variables: {
        carrierId: shippingPolicyData.listAllShippingPolicies.items[0].id,
        zipCode: "0"
      }
    })

    setCurrentTab(2)
  }

  const handlePromotionTabChange = () => {
    getPromotionData({
      variables: {
        promotionId: idCalculatorConfiguration
      }
    })

    setCurrentTab(3)
  }

  return (
    <ToastProvider>
      <Layout
        pageHeader={
          <PageHeader title={intl.formatMessage({id: 'admin/delivery-settings.navigation.label'})} />
        }>
        <PageBlock variation="full">
          <Tabs fullWidth>
            <Tab
              label={intl.formatMessage({id: 'admin/delivery-settings.tab.shipping-policy'})}
              active={currentTab === 1}
              onClick={() => setCurrentTab(1)}>
              <ShippingPolicy policies={shippingPolicyData} />
            </Tab>
            <Tab
              label={intl.formatMessage({id: 'admin/delivery-settings.tab.shipping-rate'})}
              active={currentTab === 2}
              onClick={() => handleRateTabChange()}>
              {shippingRateData && <ShippingRate rates={shippingRateData} carrierId={shippingPolicyData.listAllShippingPolicies.items[0].id} />}
            </Tab>
            <Tab
              label={intl.formatMessage({id: 'admin/delivery-settings.tab.promotions'})}
              active={currentTab === 3}
              onClick={() => handlePromotionTabChange()}>
              {<Promotion promotion={promotionData} idCalculatorConfiguration={idCalculatorConfiguration} />}
            </Tab>
            <Tab
              label={intl.formatMessage({id: 'admin/delivery-settings.tab.warehouses'})}
              active={currentTab === 4}
              onClick={() => setCurrentTab(4)}>
              <Warehouse warehouses={warehouseData} />
            </Tab>
            <Tab
              label={intl.formatMessage({id: 'admin/delivery-settings.tab.docks'})}
              active={currentTab === 5}
              onClick={() => setCurrentTab(5)}>
              <Dock docks={dockData} />
            </Tab>
          </Tabs>
        </PageBlock>
      </Layout>
    </ToastProvider>
  )
}

export default DeliverySettings