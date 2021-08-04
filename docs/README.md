`📢 Use this project, [contribute](https://github.com/iviteb/shipping-strategy) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).`

# Shipping Strategy

The **Shipping Strategy** app is a vtex admin application that allows sellers to view and modify certain shipping settings, such as delivery time and cost, delivery on weekends and holidays, adding a free shipping type promotion.

## Configuration

Install the app on the desired **Account**. To install run: `vtex install vtex.shipping-strategy@0.x` inside the Toolbelt. 

The shipping settings will appear on `/admin/delivery-settings` route.

Once you visit that page, the entire store setup will be done automatically by the app:

1. Create a default dock
2. Create a default warehouse

The delivery cost and time, delivery on weekends/holidays, free shipping can be updated by entering the desired number and hitting the Update button

For the free shipping type promotion, in order to create one, toggle on the free shipping and enter a minimum threshold (the minimum amount on an order from which the free shipping will be applied). To inactivate it, toggle off the free shipping. 

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<table>
  <tr>
    <td align="center"><a href="https://github.com/razvanudream"><img src="https://avatars.githubusercontent.com/u/71461884?v=4" width="100px;" alt=""/><br /><sub><b>Razvan Udrea</b></sub></a><br /><a href="https://github.com/iviteb/shipping-strategy/commits?author=razvanudream" title="Code">💻</a></td>
  </tr>
</table>

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
