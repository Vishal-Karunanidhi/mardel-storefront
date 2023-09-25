import { useState, useEffect } from 'react';
import { Divider } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import HLSelect from '@Components/common/hlSelect';
import LatestOrder from '@Components/account/latestOrder';
import { OrderBasicDetails } from '@Components/account/latestOrder';
import { getCustomerOrders } from '@Lib/cms/orderDetails';
import { useDispatch, useSelector } from '@Redux/store';
import OrderHistoryStyles from '@Styles/account/orderHistory.module.scss';
import MyAccountStyles from '@Styles/my-account/myAccount.module.scss';
import { spinnerStart, spinnerEnd } from '@Utils/spinnerUtil';

const orderFilterData = [
  {
    code: 'mostRecent',
    name: 'Most Recent',
    direction: 'desc'
  },
  {
    code: 'oldest',
    name: 'Oldest',
    direction: 'asc'
  }
];

export default function OrderHistory(): JSX.Element {
  const dispatch = useDispatch();
  const { isInitialLoading } = useSelector((state) => state.layout.spinnerData);
  const [currentData, setCurrentData] = useState(orderFilterData?.[0]?.code);
  const [sortDir, setSortDir] = useState('desc');
  const [orderList, setOrderList] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    spinnerStart.payload.isInitialLoading = true;
    dispatch(spinnerStart);
    getCustomerOrderList(pageNumber, sortDir);
  }, []);

  if (isInitialLoading) {
    return <div className={MyAccountStyles.divIsInitialLoading} />;
  }

  if (!orderList?.length && !isInitialLoading) {
    return <span className={OrderHistoryStyles.orderNotFound}>Orders Not Found ! </span>;
  }

  async function getCustomerOrderList(pageNumber, sortDirection) {
    const elementsPerPage = 10;

    const orderFilters = { pageNumber, sortDirection };
    const orderHistoryList = (await getCustomerOrders(orderFilters)) ?? {};
    setOrderList(orderHistoryList?.orderList);
    const totalCount = orderHistoryList?.totalCount - 1;
    const totalPages = Math.ceil(totalCount / elementsPerPage);
    setPageCount(totalPages);
    dispatch(spinnerEnd);
  }

  function OrderListPagination(props: any): JSX.Element {
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPageNumber(value);
      getCustomerOrderList(value, sortDir);
    };

    return (
      <Pagination
        page={pageNumber}
        count={pageCount}
        onChange={handleChange}
        renderItem={(item) => <PaginationItem {...item} />}
      />
    );
  }

  const handleChangeOrderFilterData = (e) => {
    const currentValue = e?.target?.value;
    const sortDirValue = currentValue === 'mostRecent' ? 'desc' : 'asc';
    setSortDir(sortDirValue);
    setCurrentData(currentValue);

    getCustomerOrderList(pageNumber, sortDirValue);
  };

  return (
    <div className={OrderHistoryStyles.orderHistory}>
      <span className={OrderHistoryStyles.orderHistoryTitle}>Order History</span>
      <LatestOrder />
      <span className={OrderHistoryStyles.previousOrder}>
        <span className={OrderHistoryStyles.orderHistoryTitle}>YOUR PREVIOUS ORDERS</span>
        <HLSelect
          handleSelectOnChange={handleChangeOrderFilterData}
          selectBoxData={orderFilterData}
          selectBoxValue={currentData}
        />
      </span>
      <span className={OrderHistoryStyles.orderBasicDetails}>
        {orderList?.map((order, index) => (
          <>
            <OrderBasicDetails {...order} />

            {index !== orderList?.length - 1 && (
              <Divider className={OrderHistoryStyles.orderSectionDivider} />
            )}
          </>
        ))}
      </span>
      <span className={OrderHistoryStyles.orderPagination}>
        <OrderListPagination />
      </span>
    </div>
  );
}
