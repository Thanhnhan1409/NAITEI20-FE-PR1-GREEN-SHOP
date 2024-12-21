import { Breadcrumb, Button, Card, Form, Input, Modal, Space, Table, message } from "antd";
import { useEffect, useState } from "react";
import http from "../../../utils/http";
import { useLoadingStore } from "../../../stores/loadingStore";
import { Category } from "../../../types/category.type";
import { PlusOutlined, CloseOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

enum EMode {
  ADD = 'add',
  VIEW = 'view',
  EDIT = 'edit'
}

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openSubCategoriesModal, setOpenSubCategoriesModal] = useState(false);
  const [currentSubCategories, setCurrentSubCategories] = useState<Category[]>([]);
  const { setIsLoading } = useLoadingStore();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [currentId, setCurrentId] = useState<string>('');
  const [mode, setMode] = useState<EMode>(EMode.ADD);
  const [showCategories, setShowCategories] = useState<Category[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [form] = Form.useForm();

  const { Search } = Input;

  const getCategoryList = async () => {
    try {
      setIsLoading(true);
      const res = await http.get("/categories");
      setCategories(res.data);
      setShowCategories(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      setIsLoading(true);
      await http.delete(`/categories/${id}`);
      getCategoryList();
      message.success("Xóa danh mục thành công!");
    } catch (error) {
      console.log(error);
      message.error("Xóa danh mục thất bại!");
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddCategory = async () => {
    try {
      setIsLoading(true);
      const values = form.getFieldsValue();
      await http.post('/categories', values.items[0]);
      getCategoryList();
      setOpenSubCategoriesModal(false);
      form.resetFields();
      message.success("Thêm danh mục thành công!");
    } catch (error) {
      console.log(error);
      message.error("Thêm danh mục thất bại!");
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditCategory = async (name: string = '') => {
    try {
      setIsLoading(true);
      const values = form.getFieldsValue();
      if(mode === EMode.VIEW) {
        form.setFieldsValue({
          items: [
            categories.filter((category: Category) => category.id === currentId)[0]
          ],
        });
        values.items[0].subcategories = values.items[0].subcategories.filter((category: Category) => category.name !== name);
      }
      await http.put(`/categories/${values.items[0].id}`, values.items[0]);
      getCategoryList();
      setOpenSubCategoriesModal(false);
      form.resetFields();
      message.success("Chỉnh sửa danh mục thành công!");
    } catch (error) {
      console.log(error);
      message.error("Chỉnh sửa danh mục thất bại!");
    } finally {
      setIsLoading(false);
    }
  }

  const handlePageChange = (page:number) => {
    setCurrentPage(page);
  }

  const handleEdit = (id: string) => {
    setOpenSubCategoriesModal(true);
    setMode(EMode.EDIT);
    form.setFieldsValue({
      items: [
        categories.filter((category: Category) => category.id === id)[0]
      ],
    });
  }

  const handleDelete = (id: string) => {
    deleteCategory(id);
    setOpenConfirmModal(false);
  }

  const handleShowSubCategories = (id: string) => {
    setMode(EMode.VIEW);
    setCurrentId(id);
    setOpenSubCategoriesModal(true);
    setCurrentSubCategories(categories.filter((category: Category) => category.id === id)[0]?.subcategories);
  }

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_: number, __: Category, index: number) => {
        return (currentPage - 1) * 10 + index + 1;
      },
      width: "10%",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "20%",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a: Category, b: Category) => a.name.localeCompare(b.name),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (_: string, record: Category) => (
        <div className="flex items-center gap-6">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>Chỉnh sửa</Button>
          <Button type="link" icon={<DeleteOutlined />} danger onClick={() => {
            setOpenConfirmModal(true);
            setDeleteId(record.id);
          }}>Xóa</Button>
          <Button className="bg-white" onClick={() => handleShowSubCategories(record.id)}>Xem danh mục con</Button>
        </div>
      ),
      width: "40%",
    }
  ];

  const subCategorisColumns = [
    {
      title: "STT",
      key: "index",
      render: (_: number, __: Category, index: number) => {
        return (currentPage - 1) * 5 + index + 1;
      },
      width: "20%",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: "80%",
    }
  ]

  useEffect(() => {
    getCategoryList();
  }, [])

  const openModel = () => {
    setMode(EMode.ADD);
    setOpenSubCategoriesModal(true);
  }

  const closeModal = () => {
    setOpenSubCategoriesModal(false);
    form.resetFields();
  }

  const onSearch = () => {
    const showCategories = categories.filter((category: Category) => category.name.toLowerCase().includes(searchValue.toLowerCase()));
    setShowCategories(showCategories);
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
              title: <div className="text-green-600">Danh sách danh mục sản phẩm</div>,
            },
          ]}
        />
      </div>
      <div className="flex justify-between items-center pb-6 mb-5">
        <h2 className="text-2xl font-semibold text-green-600 mb-3 uppercase">Danh sách danh mục sản phẩm</h2>
        <div className="flex items-center gap-3">
          <Search placeholder="Tìm kiếm" value={searchValue} onChange={e => setSearchValue(e.target.value)} onSearch={onSearch} style={{ width: 250 }} />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openModel}
          >
            Thêm danh mục
          </Button>
        </div>

      </div>
      <Table
        dataSource={showCategories}
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
        open={openSubCategoriesModal}
        title={
          <div className="flex items-center justify-between">
            <p className="text-[#22c55e]">
              {
                mode === EMode.VIEW ? 
                  'Danh mục sản phẩm con'
                  : mode === EMode.ADD ? 'Thêm danh mục' : 
                  'Chỉnh sửa danh mục'}</p>
          </div>
        }
        width={mode === EMode.VIEW ? 800 : 600}
        styles={{
          header: {
            padding: '20px 0',
          }
        }}
        onCancel={closeModal}
        footer={[
          <Button key="back" onClick={closeModal}>
            Cancel
          </Button>
        ]}
      >
        { mode !== EMode.VIEW ?
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            form={form}
            name="dynamic_form_complex"
            style={{ maxWidth: 600 }}
            autoComplete="off"
            initialValues={{ items: [{}] }}
          >
            <Form.List name="items">
              {(fields) => (
                <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                  {fields.map((field) => (
                    <Card
                      size="small"
                      title={''}
                      key={field.key}
                    >
                      <Form.Item label="Tên" name={[field.name, 'name']}>
                        <Input />
                      </Form.Item>

                      {/* Nest Form.List */}
                      <Form.Item label="Danh mục con">
                        <Form.List name={[field.name, 'subcategories']}>
                          {(subFields, subOpt) => (
                            <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                              {subFields.map((subField) => (
                                <Space key={subField.key}>
                                  <Form.Item noStyle name={[subField.name, 'name']}>
                                    <Input placeholder="Tên" />
                                  </Form.Item>
                                  <CloseOutlined
                                    onClick={() => {
                                      subOpt.remove(subField.name);
                                    }}
                                  />
                                </Space>
                              ))}
                              <Button type="dashed" onClick={() => subOpt.add()} block>
                                + Add Sub Item
                              </Button>
                            </div>
                          )}
                        </Form.List>
                      </Form.Item>
                      <Form.Item className="flex justify-end w-full">
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{width: '100%', marginLeft: '33%'}}
                          onClick={mode === EMode.ADD ? handleAddCategory : () => handleEditCategory()}
                        >
                          Submit
                        </Button>
                      </Form.Item>
                    </Card>
                  ))}
                </div>
              )}
            </Form.List>
          </Form>
        : <Table
            dataSource={currentSubCategories}
            columns={subCategorisColumns}
            rowKey="id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: 5,
              onChange: handlePageChange,
            }}
          />
        }
      </Modal>

      <Modal
        title="Xác nhận"
        open={openConfirmModal}
        onCancel={() => setOpenConfirmModal(false)}
        onOk={() => handleDelete(deleteId)}
      >
        <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
      </Modal>
    </div>
  );
}

export default CategoriesManagement;
