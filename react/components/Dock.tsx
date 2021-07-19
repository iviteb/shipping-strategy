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
        title: intl.formatMessage({id: 'admin/dock.label.id'}),
      },
      name: {
        title: intl.formatMessage({id: 'admin/dock.label.name'}),
      },
      isActive: {
        title: intl.formatMessage({id: 'admin/dock.label.status'}),
        cellRenderer: ({ cellData }: any) => {
          return (
            <Tag type={cellData ? "success" : "regular"}>
              {cellData ? intl.formatMessage({id: 'admin/dock.active.success'}) : intl.formatMessage({id: 'admin/dock.active.regular'})}
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
    <div className={`pt6`}>
      <Table
        fullWidth={true}
        schema={dockSchema}
        items={dockItems}
        density="medium"
      />
    </div>
  )
}

export default Dock