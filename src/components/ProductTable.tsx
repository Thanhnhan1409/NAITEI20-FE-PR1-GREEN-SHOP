import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, Form, Popconfirm, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Product } from '../types/product.type';
import http from '../utils/http';
import CategorySelector from './CategorySelector';
import { Category } from '../types/category.type';
import { SelectedCategory } from './CategorySelector';
import ImageUploader from './ImageUploader';
import { Order } from '../types/order.type';

const { Search } = Input;
const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategory>({ lv0: '', lv1: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState<string>('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        http.get("/products"),
        http.get("/orders"),
      ]);
      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch {
      message.error('Không thể lấy danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await http.get('/categories');
      setCategories(response.data);
    } catch {
      message.error('Không thể lấy danh mục.');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = products.filter((product) =>
      product.name?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const openModal = (product?: Product) => {
    setEditingProduct(product || null);
    form.resetFields();
    if (product) {
      form.setFieldsValue(product);
      setSelectedCategories({
        lv0: product.category?.lv0 || '',
        lv1: product.category?.lv1 ? product.category.lv1 : undefined,
      });
    } else {
      setSelectedCategories({ lv0: '', lv1: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const calculateSales = (productId: string) => {
    return orders.reduce((total, order) => {
      const product = order.products.find((prod) => prod.id === productId);
      return total + (product ? product.quantity : 0);
    }, 0);
  };  

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        const updatedProduct = {
          ...editingProduct,
          ...values,
          comments: editingProduct.comments,
          sales: editingProduct.sales,
          discount: editingProduct.discount,
          oldPrice: editingProduct.oldPrice,
        };
  
        await http.put(`/products/${editingProduct.id}`, updatedProduct);
        setProducts((prev) => {
          const updatedProducts = prev.map((prod) =>
            prod.id === editingProduct.id ? { ...prod, ...updatedProduct } : prod
          );
          setFilteredProducts(updatedProducts);
          return updatedProducts;
        });
        message.success('Cập nhật sản phẩm thành công.');
      } else {
        const response = await http.post('/products', { ...values, id: String(Date.now()) });
        setProducts((prev) => {
          const newProducts = [...prev, response.data];
          setFilteredProducts(newProducts);
          return newProducts;
        });
        message.success('Thêm sản phẩm mới thành công.');
      }
      closeModal();
    } catch {
      message.error('Không thể lưu sản phẩm.');
    }
  };
  

  const handleDelete = async (id: string) => {
    try {
      await http.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      setFilteredProducts((prev) => prev.filter((product) => product.id !== id));
      message.success('Xóa sản phẩm thành công.');
    } catch {
      message.error('Không thể xóa sản phẩm.');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "No",
      key: "index",
      render: (_: number, __: Product, index: number) => {
        return (currentPage - 1) * 10 + index + 1;
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Product, b: Product) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: Product, b: Product) => (a.price || 0) - (b.price || 0),
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: 'Số lượng đã bán',
      key: 'sales',
      sorter: (a: Product, b: Product) => calculateSales(a.id || '') - calculateSales(b.id || ''),
      render: (_: string, record: Product) => {
        return calculateSales(record.id || '');
      },
    },
    {
      title: 'Danh mục',
      key: 'category',
      render: (_: string, record: Product) => (
        <div>
          {record.category?.lv0 && (
            <Tag color="blue">{record.category.lv0}</Tag>
          )}
          {record.category?.lv1 && (
            <Tag color="green">{record.category.lv1}</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: number, record: Product) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            type="link"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
            onConfirm={() => record.id && handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger type="link">
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Search
          placeholder="Tìm kiếm sản phẩm"
          allowClear
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
        >
          Thêm sản phẩm
        </Button>
      </div>
      <Table
        dataSource={filteredProducts}
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
        title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Tên sản phẩm không được để trống' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: 'Giá không được để trống' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: 'Danh mục không được để trống' }]}>
            {editingProduct ? (
              <CategorySelector
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                onChange={(value) => {
                  form.setFieldsValue({ categories: value });
                }}
              />
            ) : (
              <CategorySelector
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                onChange={(value) => {
                  form.setFieldsValue({ categories: value });
                }}
              />
            )}
          </Form.Item>
          <Form.Item
            label="Tên khoa học"
            name="scientificName"
            rules={[{ required: true, message: 'Tên khoa học không được để trống' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Họ thực vật"
            name="plantFamily"
            rules={[{ required: true, message: 'Họ thực vật không được để trống' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Chiều cao"
            name="height"
            rules={[{ required: true, message: 'Chiều cao không được để trống' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Nguồn gốc"
            name="origin"
            rules={[{ required: true, message: 'Nguồn gốc không được để trống' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Mô tả không được để trống' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Ảnh sản phẩm"
            name="images"
            valuePropName="value"
          >
            <ImageUploader />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductTable;
