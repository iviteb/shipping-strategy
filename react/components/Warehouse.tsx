import React, { FC } from 'react'
import { useIntl } from 'react-intl'
import { 
  PageHeader,
  Table, 
  Tag
} from 'vtex.styleguide'

interface WarehouseProps {
  warehouses: any
}

const Warehouse: FC<WarehouseProps> = ({ warehouses }) => {
 
  if (!warehouses) return null

  const intl = useIntl()

  const warehouseSchema = {
    properties: {
      id: {
        title: 'ID',
        width: 80
      },
      name: {
        title: intl.formatMessage({
          id: 'admin/shipping-strategy.table-columns.name'
        }),
        width: 170,
      },
      isActive: {
        title: intl.formatMessage({
          id: 'admin/shipping-strategy.table-columns.isActive'
        }),
        width: 150,
        cellRenderer: ({ cellData }: any) => {
          return (
            <Tag type={cellData ? "success" : "regular"}>
              {cellData ? "Active" : "Inactive"}
            </Tag>
          )
        },
      },
    }
  }

  const warehouseItems = warehouses.listAllWarehouses.map((warehouse: any) => ({
    id: warehouse.id,
    name: warehouse.name,
    isActive: warehouse.isActive
  }))

  return (
    <>
      <div className={`tc`}>
        <PageHeader title="Warehouse" />
      </div>
      <Table
        fullWidth
        schema={warehouseSchema}
        items={warehouseItems}
        density="medium"
      />
    </>
    
  )
}

export default Warehouse