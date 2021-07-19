import React, { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import { useMutation } from 'react-apollo'
import { 
  Table,
  InputButton,
  Toggle
} from 'vtex.styleguide'
import GET_PROMOTIONS from '../graphql/allPromotions.graphql'
import CREATE_OR_UPDATE_PROMOTION from '../graphql/createOrUpdatePromotion.graphql'

interface PromotionProps {
  promotion: any
  idCalculatorConfiguration: string | undefined
}

const Promotion: FC<PromotionProps> = ({ promotion, idCalculatorConfiguration }) => {

  if (!promotion) return null

  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(0)
  const [isActive, setIsActive] = useState(promotion.listPromotionById.isActive)
  const intl = useIntl()

  const [createOrUpdatePromotion] = useMutation(CREATE_OR_UPDATE_PROMOTION, {
    refetchQueries: [
      { query: GET_PROMOTIONS } 
    ]
  })

  const handlePromotionChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    const threshold = Number(evt.target.value)

    setFreeDeliveryThreshold(threshold)
  }

  const handleToggleChange = () => {
    setIsActive(!isActive)
    handlePromotionToggleChange()
  }

  const handlePromotionToggleChange = () => {
    createOrUpdatePromotion({
      variables: {
        newTotalValueCeling: freeDeliveryThreshold !== 0 ? freeDeliveryThreshold : promotion.listPromotionById.totalValueCeling,
        promotionId: idCalculatorConfiguration,
        beginDateUtc: promotion.listPromotionById.beginDateUtc,
        endDateUtc: promotion.listPromotionById.endDateUtc,
        isActive: !isActive
      }
    })

    setFreeDeliveryThreshold(0)
  }

  const handlePromotionSubmit = () => {
    createOrUpdatePromotion({
      variables: {
        newTotalValueCeling: freeDeliveryThreshold !== 0 ? freeDeliveryThreshold : promotion.listPromotionById.totalValueCeling,
        promotionId: idCalculatorConfiguration,
        beginDateUtc: promotion.listPromotionById.beginDateUtc,
        endDateUtc: promotion.listPromotionById.endDateUtc,
        isActive: isActive
      }
    })

    setFreeDeliveryThreshold(0)
  }

  const promotionSchema = {
    properties: {
      id: {
        title: intl.formatMessage({
          id: 'admin/promotion.table-columns.id'
        }),
        width: 400
      },
      name: {
        title: intl.formatMessage({
          id: 'admin/promotion.table-columns.name'
        }),
        width: 200,
      },
      freeDeliveryThreshold: {
        title: intl.formatMessage({
          id: 'admin/promotion.table-columns.free-delivery-threshold'
        }),
        width: 200,
      }
    },
  }

  const promotionItems = [{
    id: promotion.listPromotionById.idCalculatorConfiguration,
    name: promotion.listPromotionById.name,
    freeDeliveryThreshold: promotion.listPromotionById.totalValueCeling
  }]

  return (
    <div className={`pt6`}>
      <div className={`flex mb6`}>
        <Toggle 
          semantic
          label={intl.formatMessage({id: 'admin/promotion.label.isActive'})}
          size="large"
          checked={isActive}
          onChange={handleToggleChange}
        />
      </div>
      <form onSubmit={handlePromotionSubmit}>
        <InputButton 
          placeholder={intl.formatMessage({id: 'admin/promotion.input-button.placeholder'})}
          size="regular" 
          button="Submit" 
          onChange={handlePromotionChange}
        />
      </form>
      {promotion && <Table
        fullWidth
        schema={promotionSchema}
        items={promotionItems}
        density="medium"
      />}
    </div>
  )
}

export default Promotion