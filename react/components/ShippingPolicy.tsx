import React, { useState, FC } from 'react'
import { useMutation } from 'react-apollo'
import { useIntl } from 'react-intl'
import { 
  ButtonWithIcon, 
  IconEdit,
  Input,
  Toggle,
  ToastConsumer
} from 'vtex.styleguide'
import UPDATE_SHIPPING from '../graphql/updateShipping.graphql'
import GET_SHIPPING_POLICIES from '../graphql/shipping.graphql'

interface ShippingPolicyProps {
  policies: any
}

interface ShippingPolicyInput {
  id: String
  name: String
  shippingMethod: String
  isSaturdayActive: Boolean
  isSundayActive: Boolean
  isHolidayActive: Boolean
  largestMeasure: Number
  maxMeasureSum: Number
  isActive: Boolean
}

const ShippingPolicy: FC<ShippingPolicyProps> = ({ policies }) => {
  
  if (!policies) return null

  const [shippingPolicy, setShippingPolicy] = useState<ShippingPolicyInput>({
    id: policies.listAllShippingPolicies.items[0].id,
    name: policies.listAllShippingPolicies.items[0].name,
    shippingMethod: policies.listAllShippingPolicies.items[0].shippingMethod,
    isSaturdayActive: policies.listAllShippingPolicies.items[0].weekendAndHolidays.saturday,
    isSundayActive: policies.listAllShippingPolicies.items[0].weekendAndHolidays.sunday,
    isHolidayActive: policies.listAllShippingPolicies.items[0].weekendAndHolidays.holiday,
    largestMeasure: policies.listAllShippingPolicies.items[0].maxDimension.largestMeasure,
    maxMeasureSum: policies.listAllShippingPolicies.items[0].maxDimension.maxMeasureSum,
    isActive: policies.listAllShippingPolicies.items[0].isActive
  })

  const [updateShippingPolicy] = useMutation(UPDATE_SHIPPING, {
    refetchQueries: [
      { query: GET_SHIPPING_POLICIES }
    ]
  })

  const intl = useIntl()

  const handleSubmit = async (showToast: any) => {
    await updateShippingPolicy({variables: {
      ...shippingPolicy
    }}).catch(err => {
      console.error(err)
      showToast({
        message: intl.formatMessage({
          id: 'admin/shipping-policy.toast.failure',
        }),
        duration: 5000,
      })
    })
    .then(() => {
      showToast({
        message: intl.formatMessage({
          id: 'admin/shipping-policy.toast.success',
        }),
        duration: 5000,
      })
    })
  }

  return (
    <div className={`pt6`}>
      <div className={`flex mb4`}>
        <div className={`w-50 mr4`}>
          <Input
            value={policies.listAllShippingPolicies.items[0].name}
            readOnly={true}
            label={intl.formatMessage({id: 'admin/shipping-policy.label.name'})}
          />
        </div>
        <div className={`w-50`}>
          <Input
            value={policies.listAllShippingPolicies.items[0].id}
            readOnly={true}
            label={intl.formatMessage({id: 'admin/shipping-policy.label.id'})}
          />
        </div>
      </div>
      <div className={`flex mb4`}>
        <Input
          value={policies.listAllShippingPolicies.items[0].shippingMethod}
          readOnly={true}
          label={intl.formatMessage({id: 'admin/shipping-policy.label.shipping-method'})}
        />
      </div>
      <div className={`flex mb4`}>
        <Toggle 
          semantic
          label={intl.formatMessage({id: 'admin/shipping-policy.label.holiday'})}
          size="large"
          checked={shippingPolicy.isHolidayActive}
          onChange={() => {
            setShippingPolicy({
              ...shippingPolicy,
              isHolidayActive: !shippingPolicy.isHolidayActive
            })
          }}
        />
      </div>
      <div className={`flex mb4`}>
        <Toggle 
          semantic
          label={intl.formatMessage({id: 'admin/shipping-policy.label.saturday'})}
          size="large"
          checked={shippingPolicy.isSaturdayActive}
          onChange={() => {
            setShippingPolicy({
              ...shippingPolicy,
              isSaturdayActive: !shippingPolicy.isSaturdayActive
            })
          }}
        />
      </div>
      <div className={`flex mb4`}>
        <Toggle 
          semantic
          label={intl.formatMessage({id: 'admin/shipping-policy.label.sunday'})}
          size="large"
          checked={shippingPolicy.isSundayActive}
          onChange={() => {
            setShippingPolicy({
              ...shippingPolicy,
              isSundayActive: !shippingPolicy.isSundayActive
            })
          }}
        />
      </div>

      <ToastConsumer>
        {({ showToast }: { showToast: any }) => (
          <ButtonWithIcon
            icon={<IconEdit />}
            variation={"tertiary"}
            onClick={() => handleSubmit(showToast)}
          > 
          {intl.formatMessage({id: 'admin/shipping-policy.button.update'})}
          </ButtonWithIcon>
        )}
      </ToastConsumer>
      
    </div>
  )
}

export default ShippingPolicy