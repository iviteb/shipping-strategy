import React, { useState, FC } from 'react'
import { useIntl } from 'react-intl'
import { 
  Table, 
  Tag, 
  Button, 
  IconEdit, 
  PageHeader,
  Modal, 
  Input,
  Box
} from 'vtex.styleguide'

interface ShippingPolicyProps {
  policies: any
}

const ShippingPolicy: FC<ShippingPolicyProps> = ({ policies }) => {

  if (!policies) return null

  const [isModalOpen, setIsModalOpen] = useState(false)
  const intl = useIntl()

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
            <Button
              variation={"tertiary"}
              onClick={() => handleModalOpen()}
            > 
              <IconEdit />
            </Button>
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
      <div className={`tc`}>
        <PageHeader title="Shipping policy" />
      </div>
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
              <div className={`flex`}>
                <Input
                  value={policies.listAllShippingPolicies.items[0].shippingMethod}
                  readOnly={true}
                  label="Shipping method"
                />
              </div>
            </Box>
          </div>
      </Modal>
    </>
  )
}

export default ShippingPolicy