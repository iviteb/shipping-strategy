import React, { useState, FC } from 'react'
import { useMutation } from 'react-apollo'
import { useIntl } from 'react-intl'
import { 
  Table, 
  Input,
  ButtonWithIcon,
  ToastConsumer
} from 'vtex.styleguide'
import GET_SHIPPING_RATES from '../graphql/freight.graphql'
import UPDATE_SHIPPING_RATE from '../graphql/updateShippingRate.graphql'

interface ShippingRateProps {
  rates: any
  carrierId: string
}

interface ShippingRateInput {
  carrierId: string
  searchZipCode: string
  input: [ShippingRateInputData]
}

interface ShippingRateInputData {
  zipCodeStart: string
  zipCodeEnd: string
  weightStart: number
  weightEnd: number
  absoluteMoneyCost: string
  pricePercent: number
  pricePercentByWeight: number
  maxVolume: number
  timeCost: string
  timeCostToDisplay: string
  country: string
  operationType: number
  polygon: string
  minimumValueInsurance: number
}

const ShippingRate: FC<ShippingRateProps> = ({ rates, carrierId }) => {
  
  if (!rates) return null

  const [shippingRate, setShippingRate] = useState<ShippingRateInput>({
    carrierId: carrierId,
    searchZipCode: "0",
    input: rates.listShippingRate.map((rate: ShippingRateInputData) => ({
      zipCodeStart: rate.zipCodeStart,
      zipCodeEnd: rate.zipCodeEnd,
      weightStart: rate.weightStart,
      weightEnd: rate.weightEnd,
      absoluteMoneyCost: rate.absoluteMoneyCost,
      pricePercent: rate.pricePercent,
      pricePercentByWeight: rate.pricePercentByWeight,
      maxVolume: rate.maxVolume,
      timeCost: rate.timeCost,
      timeCostToDisplay: rate.timeCost.split(".")[0],
      country: rate.country,
      operationType: 2,
      polygon: rate.polygon,
      minimumValueInsurance: rate.minimumValueInsurance
    }))
  })

  const [updateShippingRate] = useMutation(UPDATE_SHIPPING_RATE, {
    refetchQueries: [
      { query: GET_SHIPPING_RATES, variables: {carrierId: carrierId, zipCode: "0"} }
    ]
  })

  const intl = useIntl()

  const handleChangeRate = (id: any, e: any) => {
    shippingRate.input[id].absoluteMoneyCost = e.target.value
    setShippingRate({
      ...shippingRate,
      input: shippingRate.input
    })
  }

  const handleChangeDelivery = (id: any, e: any) => {
    shippingRate.input[id].timeCost = e.target.value.length <= 4 ? e.target.value + ".00:00:00" : e.target.value
    shippingRate.input[id].timeCostToDisplay = e.target.value
    setShippingRate({
      ...shippingRate,
      input: shippingRate.input
    })
  }

  const handleSubmit = async (showToast: any) => {
    await updateShippingRate({variables: {
      ...shippingRate
    }}).catch(err => {
      console.error(err)
      showToast({
        message: intl.formatMessage({
          id: 'admin/shipping-rate.toast.failure',
        }),
        duration: 5000,
      })
    })
    .then(() => {
      showToast({
        message: intl.formatMessage({
          id: 'admin/shipping-rate.toast.success',
        }),
        duration: 5000,
      })
    })
  }

  const shippingRateSchema = {
    properties: {
      zipCodeRange: {
        title: intl.formatMessage({
          id: 'admin/shipping-rate.table-columns.postal-code-range'
        }),
        width: 180
      },
      weightRange: {
        title: intl.formatMessage({
          id: 'admin/shipping-rate.table-columns.weight-range'
        }),
        width: 160,
      },
      country: {
        title: intl.formatMessage({
          id: 'admin/shipping-rate.table-columns.country'
        }),
        width: 100,
      },
      shippingRate: {
        title: intl.formatMessage({
          id: 'admin/shipping-rate.table-columns.shipping-rate'
        }),
        width: 120,
        cellRenderer: ({ rowData }: any) => {
          return (
            <Input 
              value={shippingRate.input[rowData.id].absoluteMoneyCost}
              onChange={(e: any) => handleChangeRate(rowData.id, e)}
            />
          )
        }
      },
      deliveryTime: {
        title: intl.formatMessage({
          id: 'admin/shipping-rate.table-columns.delivery-time'
        }),
        width: 140,
        cellRenderer: ({ rowData }: any) => {
          return (
            <Input 
              value={shippingRate.input[rowData.id].timeCostToDisplay}
              onChange={(e: any) => handleChangeDelivery(rowData.id, e)}
            />
          )
        }
      },
      actions: {
        width: 180,
        title: intl.formatMessage({
          id: 'admin/shipping-rate.table-columns.actions'
        }),
        cellRenderer: () => {
          return (
            <ToastConsumer>
              {({ showToast }: { showToast: any }) => (
                <ButtonWithIcon
                    variation={"tertiary"}
                    onClick={() => handleSubmit(showToast)}
                  > 
                    {intl.formatMessage({id: 'admin/shipping-policy.button.update'})}
                </ButtonWithIcon>
              )}
            </ToastConsumer>
          );
        }
      }
    },
  }

  const shippingRateItems = rates.listShippingRate.map((rate: any, index: any) => ({
    id: index,
    zipCodeRange: rate.zipCodeStart + " - " + rate.zipCodeEnd,
    weightRange: rate.weightStart + " - " + rate.weightEnd,
    country: rate.country,
    shippingRate: rate.absoluteMoneyCost,
    deliveryTime: rate.timeCostToDisplay
  }))

  return (
    <div className={`pt6`}>
      <Table
        fullWidth
        schema={shippingRateSchema}
        items={shippingRateItems}
        density="medium"
      />
    </div>    
  )
}

export default ShippingRate