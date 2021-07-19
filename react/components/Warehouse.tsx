import React, { FC } from 'react'
import { useIntl } from 'react-intl'
import { 
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
        title: intl.formatMessage({id: 'admin/warehouse.label.id'}),
      },
      name: {
        title: intl.formatMessage({id: 'admin/warehouse.label.name'}),
      },
      isActive: {
        title: intl.formatMessage({id: 'admin/warehouse.label.status'}),
        cellRenderer: ({ cellData }: any) => {
          return (
            <Tag type={cellData ? "success" : "regular"}>
              {cellData ? intl.formatMessage({id: 'admin/warehouse.active.success'}) : intl.formatMessage({id: 'admin/warehouse.active.regular'})}
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
    <div className={`pt6`}>
      <Table
        fullWidth={true}
        schema={warehouseSchema}
        items={warehouseItems}
        density="medium"
      />
    </div>
  )
}

export default Warehouse