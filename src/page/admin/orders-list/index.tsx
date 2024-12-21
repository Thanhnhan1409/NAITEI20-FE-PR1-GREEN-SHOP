import { Breadcrumb, Button, Input, Modal, Table } from "antd";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { Order } from "../../../types/order.type";
import { useLoadingStore } from "../../../stores/loadingStore";
import http from "../../../utils/http";
import { formatNumberWithDots } from "../../../utils";
import { CartItem } from "../../../types/cartItem.type";

const OrdersManagement = () => {
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [currentDetailOder, setCurrentDetailOder] = React.useState<Order>();
  const [searchValue, setSearchValue] = React.useState('');
  const [showOrders, setShowOrders] = React.useState<Order[]>([]);

  const { setIsLoading } = useLoadingStore();
  const { Search } = Input;
  const getOrdersList = async () => {
    try {
      setIsLoading(true);
      const res = await http.get("/orders");
      setOrders(res.data);
      setShowOrders(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getOrdersList();
  },[]);

  const viewDetail = (id: string) => {
    setOpen(true);
    setCurrentDetailOder(orders.find((order) => order.id === id));
  }

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_: number, __: Order, index: number) => {
        return (currentPage - 1) * 10 + index + 1;
      },
      width: "10%",
    },
    {
      title: "ID",
      dataIndex: "Mã đơn hàng",
      key: "id",
      render: (_: number, record: Order) => <span>#{record.id}</span>,
      width: "10%",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "user",
      key: "user",
      render: (_: number, record: Order) => <span>{record.user.fullName}</span>,
      width: "20%",
      sorter: (a: Order, b: Order) => a.user.fullName.localeCompare(b.user.fullName),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (_: number, record: Order) => <p className="py-0.5 px-4 border rounded-lg w-fit border-[#22c55e] text-[grey]">{formatNumberWithDots(record.total)} đ</p>,
      width: "20%",
      sorter: (a: Order, b: Order) => a.total - b.total,
    },
    {
      title: "Ngày mua hàng",
      dataIndex: "date",
      key: "date",
      render: (_: number, record: Order) => <span>{new Date(record.date).toLocaleDateString()}</span>,
      sorter: (a: Order, b: Order) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: Order) => (
        <div>
          <Button type="primary" className="mr-2" onClick={() => viewDetail(record.id)}>
            Xem chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const detailColumns = [
    {
      title: "STT",
      key: "index",
      render: (_: number, __: CartItem, index: number) => {
        return (currentPage - 1) * 10 + index + 1;
      },
      width: "10%",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: "product",
      render: (_: number, record: CartItem) => <span>{record.name}</span>,
      width: "30%",
      sorter: (a: CartItem, b: CartItem) => a.name.localeCompare(b.name),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "dimageate",
      render: (_: number, record: CartItem) => <img src={record.image} alt={record.name} />,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (_: number, record: CartItem) => <p>{formatNumberWithDots(record.price)} đ</p>,
      width: "20%",
      sorter: (a: CartItem, b: CartItem) => a.price - b.price,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_: number, record: CartItem) => <p>x{ record.quantity }</p>,
      width: "20%",
      sorter: (a: CartItem, b: CartItem) => a.quantity - b.quantity,
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const onSearch = () => {
    const filteredOrders = orders.filter(order => order.user.fullName.toLowerCase().includes(searchValue.toLowerCase()));
    setShowOrders(filteredOrders);
  }

  return (
    <div className="container w-[1100px] mx-auto mb-40">
      <div className="mb-5">
        <Breadcrumb
          items={[
            {
              title: <Link to="/">Home</Link>,
            },
            {
              title: <div className="text-green-600">Danh sách đơn hàng</div>,
            },
          ]}
        />
      </div>
      <div className="flex items-center justify-between pb-6">
        <h2 className="text-2xl font-semibold text-green-600 mb-3 uppercase">Danh sách đơn hàng</h2>
        <Search placeholder="Tìm kiếm" value={searchValue} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchValue(e.target.value)} onSearch={onSearch} style={{ width: 250 }} />
      </div>
      <Table
        dataSource={showOrders}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: 10,
          onChange: handlePageChange,
        }}
      />
      <Modal
        open={open}
        title={
          <div className="flex items-center justify-between">
            <p className="text-[#22c55e]">Thông tin chi tiết đơn hàng</p>
          </div>
        }
        width={800}
        styles={{
          header: {
            padding: '20px 0',
          }
        }}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        ]}
      >
        <div className="flex items-center justify-between">
          <div className="pb-6">
            <div className="flex items-center gap-2 pb-2">
              <span>Tên khách hàng:</span>
              <span>{currentDetailOder?.user.fullName}</span>  
            </div>  
            <div className="flex items-center text-[grey] text-sm gap-2 pb-2">
              <span>Mã đơn hàng:</span>
              <span>#{currentDetailOder?.id}</span>
            </div>
            <div className="flex items-center text-[grey] text-sm gap-2">
              <span>Ngày mua hàng:</span>
              <span>{new Date(currentDetailOder?.date || '').toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 py-0.5 px-2 w-fit rounded-lg border border-[#22c55e]">
            <span>Tổng tiền:</span>
            <span>{ formatNumberWithDots(currentDetailOder?.total || 0) } đ</span>
          </div>
        </div>
        <Table
          dataSource={currentDetailOder?.products}
          columns={detailColumns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: 2,
            onChange: handlePageChange,
          }}
        />
      </Modal>
      
    </div>
  );
}

export default OrdersManagement;
