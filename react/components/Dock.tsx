import React, { FC } from 'react'
import { useIntl } from 'react-intl'
import { 
  Table, 
  Tag
} from 'vtex.styleguide'

interface DockProps {
  docks: any
}

const Dock: FC<DockProps> = ({ docks }) => {

  if (!docks) return null
 
  const intl = useIntl()

  const dockSchema = {
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

  const dockItems = docks.listAllDocks.map((dock: any) => ({
    id: dock.id,
    name: dock.name,
    isActive: dock.isActive
  }))

  return (
    <Table
      fullWidth
      schema={dockSchema}
      items={dockItems}
      density="medium"
    />
  )
}

export default Dock