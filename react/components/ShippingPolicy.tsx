import React, { useState, FC } from 'react'
import { useMutation, useLazyQuery } from 'react-apollo'
import { useIntl } from 'react-intl'
import { 
  Table, 
  Tag, 
  ButtonWithIcon, 
  IconEdit,
  PageHeader,
  Modal, 
  Input,
  Toggle,
  Box
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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const intl = useIntl()

  const handleSubmit = async () => {
    updateShippingPolicy({variables: {
      ...shippingPolicy
    }})

    handleModalClose()
  }

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const shippingStrategySchema = {
    properties: {
      id: {
        title: 'ID',
        width: 80
      },
      name: {
        title: intl.formatMessage({
          id: 'admin/shipping-strategy.table-columns.name'
        }),
        width: 180,
      },
      shippingMethod: {
        title: intl.formatMessage({
          id: 'admin/shipping-strategy.table-columns.shippingMethod'
        }),
        width: 180,
      },
      isActive: {
        title: intl.formatMessage({
          id: 'admin/shipping-strategy.table-columns.isActive'
        }),
        width: 180,
        cellRenderer: ({ cellData }: any) => {
          return (
            <Tag type={cellData ? "success" : "regular"}>
              {cellData ? "Active" : "Inactive"}
            </Tag>
          )
        },
      },
      actions: {
        width: 180,
        title: intl.formatMessage({
          id: 'admin/shipping-strategy.table-columns.actions'
        }),
        cellRenderer: () => {
          return (
            <ButtonWithIcon
              icon={<IconEdit />}
              variation={"tertiary"}
              onClick={() => handleModalOpen()}
            > 
              Edit
            </ButtonWithIcon>
          );
        }
      }
    },
  }

  const shippingPolicyItems = policies.listAllShippingPolicies.items.map((policy: any) => ({
    id: policy.id,
    name: policy.name,
    shippingMethod: policy.shippingMethod,
    isActive: policy.isActive
  }))

  return (
    <>
      <Table
        fullWidth
        schema={shippingStrategySchema}
        items={shippingPolicyItems}
        density="medium"
      />
      <Modal
        centered
        isOpen={isModalOpen}
        onClose={() => handleModalClose()}>
          <div className={`pt8`}>
            <Box title="Shipping policy">
              <div className={`flex mb4`}>
                <div className={`w-50 mr4`}>
                  <Input
                    value={policies.listAllShippingPolicies.items[0].name}
                    readOnly={true}
                    label="Name"
                  />
                </div>
                <div className={`w-50`}>
                  <Input
                    value={policies.listAllShippingPolicies.items[0].id}
                    readOnly={true}
                    label="ID"
                  />
                </div>
              </div>
              <div className={`flex mb4`}>
                <Input
                  value={policies.listAllShippingPolicies.items[0].shippingMethod}
                  readOnly={true}
                  label="Shipping method"
                />
              </div>
              <div className={`flex mb4`}>
                <Toggle 
                  semantic
                  label="Holiday"
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
                  label="Saturday"
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
                  label="Sunday"
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

              <ButtonWithIcon
                icon={<IconEdit />}
                variation={"tertiary"}
                onClick={handleSubmit}
              > 
                Update
              </ButtonWithIcon>
            </Box>
          </div>
      </Modal>
    </>
  )
}

export default ShippingPolicy