import { useEffect, useState } from 'react';
import HLAnchorTag from '@Components/common/hlAnchorTag';
import { dialogContent, orderStatus } from '@Constants/orderStatus';
import OrderlookupStyles from '@Styles/orderStatus/orderLookup.module.scss';

export default function ShipmentStatus({
  creationTime,
  modifiedTime,
  orderState,
  deliveries,
  payments
}: any): JSX.Element {
  const [shipmentDetails, setShipmentDetails] = useState(null);

  useEffect(() => {
    const shipmentDetails = (deliveries.length > 0 ? deliveries : [{}]).map((delivery: any) => {
      let CurrentStateConnectorClass: string,
        CurrentStateIconClass: string,
        shipmentConnectorClass: string,
        shipmentIconClass: string,
        paymentAuthorization: string;
      switch (orderState) {
        case orderStatus.cancelled: {
          CurrentStateConnectorClass = 'orderStatusBarShipmentConnectorCancelled';
          CurrentStateIconClass = 'orderStatusBarShipmentIconCancelled';
          shipmentConnectorClass = 'orderStatusBarShipmentConnectorInActive';
          shipmentIconClass = 'orderStatusBarShipmentIconInActive';
          break;
        }
        case orderStatus.procesing: {
          CurrentStateConnectorClass = 'orderStatusBarShipmentConnectorActive';
          CurrentStateIconClass = 'orderStatusBarShipmentIconActive';
          shipmentConnectorClass = 'orderStatusBarShipmentConnectorInActive';
          shipmentIconClass = 'orderStatusBarShipmentIconInActive';
          break;
        }
        case orderStatus.shipped: {
          CurrentStateConnectorClass = 'orderStatusBarShipmentConnectorActive';
          CurrentStateIconClass = 'orderStatusBarShipmentIconActive';
          if (delivery?.parcels?.[0]?.trackingID) {
            shipmentConnectorClass = 'orderStatusBarShipmentConnectorActive';
            shipmentIconClass = 'orderStatusBarShipmentIconActive';
          } else {
            shipmentConnectorClass = 'orderStatusBarShipmentConnectorInActive';
            shipmentIconClass = 'orderStatusBarShipmentIconInActive';
          }
          break;
        }
        default: {
          CurrentStateConnectorClass = 'orderStatusBarShipmentConnectorInActive';
          CurrentStateIconClass = 'orderStatusBarShipmentIconInActive';
          shipmentConnectorClass = 'orderStatusBarShipmentConnectorInActive';
          shipmentIconClass = 'orderStatusBarShipmentIconInActive';
        }
      }
      paymentAuthorization = dialogContent.optionalDetails;
      payments.forEach(({ transactions }: any) => {
        if (
          transactions.find((transaction) => transaction.type === dialogContent.cancelAuthorization)
        ) {
          paymentAuthorization = dialogContent.paymentVoided;
        }
      });
      return {
        creationTime: creationTime,
        modifiedTime:
          orderState === 'Received'
            ? ''
            : !delivery || orderState == 'Cancelled'
            ? modifiedTime
            : creationTime,
        orderState: orderState === 'Cancelled' ? 'Cancelled' : 'Processing',
        shippmentTime: delivery?.parcels?.[0]?.creationTime,
        ShippmentTrackingID: delivery?.parcels?.[0]?.trackingID,
        ShippmentTrackingurl: delivery?.parcels?.[0]?.trackingUrl,
        ShippmentCarrier: delivery?.parcels?.[0]?.carrier,
        CurrentStateConnectorClass: CurrentStateConnectorClass,
        CurrentStateIconClass: CurrentStateIconClass,
        shipmentConnectorClass: shipmentConnectorClass,
        shipmentIconClass: shipmentIconClass,
        paymentAuthorization: paymentAuthorization
      };
    });
    setShipmentDetails(shipmentDetails);
  }, [deliveries]);

  return (
    <div>
      {(shipmentDetails ?? []).map((delivery: any, index: number) => {
        return (
          <div className={OrderlookupStyles.shipmentStatus}>
            <div className={OrderlookupStyles.shipmentStatusBar}>
              <div className={OrderlookupStyles.shipmentStatusTrackingId}>
                <div className={OrderlookupStyles.shipmentStatusTrackingIdHeader}>
                  Package {index + 1}
                </div>
                {delivery?.ShippmentTrackingID && (
                  <div className={OrderlookupStyles.shipmentStatusTrackingIdBody}>
                    <span className={OrderlookupStyles.shipmentStatusTrackingIdLabel}>
                      {delivery?.ShippmentCarrier} Tracking number:
                    </span>
                    <HLAnchorTag value={delivery?.ShippmentTrackingurl} label={delivery?.ShippmentTrackingID} anchorTheme="LinkType2" OpenInNewTab="_blank"
                    />
                  </div>
                )}
              </div>
              <div className={OrderlookupStyles.orderStatusBarShipmentBox}>
                <div className={OrderlookupStyles.orderStatusBarShipmentReceived}>
                  <div>
                    <div className={OrderlookupStyles[delivery.CurrentStateConnectorClass]}></div>
                    <div className={OrderlookupStyles.orderStatusBarShipmentIconActive}>
                      &#10003;
                    </div>
                  </div>
                  <div>Received</div>
                  <div>{creationTime}</div>
                  <div>Optional details</div>
                </div>
                <div className={OrderlookupStyles.orderStatusBarShipmentProcessing}>
                  <div>
                    <div className={OrderlookupStyles[delivery.shipmentConnectorClass]}></div>
                    <div className={OrderlookupStyles[delivery.CurrentStateIconClass]}>
                      {orderState === 'Cancelled' ? <span>&#10005;</span> : <span>&#10003;</span>}
                    </div>
                  </div>
                  <div>{delivery.orderState}</div>
                  <div>{delivery.modifiedTime}</div>
                  <div>{delivery.paymentAuthorization}</div>
                </div>
                <div className={OrderlookupStyles.orderStatusBarShipmentShipped}>
                  <div>
                    <div className={OrderlookupStyles.orderStatusBarShipmentShippedConnector}></div>
                    <div className={OrderlookupStyles[delivery.shipmentIconClass]}>&#10003;</div>
                  </div>
                  <div>Shipped</div>
                  <div>{delivery?.shippmentTime}</div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
