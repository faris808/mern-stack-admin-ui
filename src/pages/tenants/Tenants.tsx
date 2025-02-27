import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getTenants } from "../../http/api";
import { useAuthStore } from "../../store";
import React from "react";
import TenantsFilter from "./TenantsFilter";
import TenantForm from "./forms/TenantForm";
import { CreateTenantData, FieldData } from "../../types";
import { PER_PAGE } from "../../constants/constants";
import { debounce } from "lodash";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: () => {
      return (
        <div>
          <Link to="/tenants/edit">Edit</Link>
        </div>
      );
    },
  },
];

const Tenants = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [queryParam, setQueryParam] = React.useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });
  const {
    data: tenants,
    isError,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParam],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParam).filter((item) => !!item[1])
      );
      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      return getTenants(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const { user } = useAuthStore();

  const { mutate: tenantMutate } = useMutation({
    mutationKey: ["tenant"],
    mutationFn: async (data: CreateTenantData) =>
      createTenant(data).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    await tenantMutate(form.getFieldsValue());
    form.resetFields();
    setDrawerOpen(false);
  };

    const debouncedQUpdate = React.useMemo(() => {
      return debounce((value: string | undefined) => {
        setQueryParam((prev) => ({...prev, q: value, currentPage: 1})); 
      }, 500)
    },[]);
  
    const onFilterChange = (changedFields: FieldData[]) => {
      const changedFilterFields = changedFields
        .map((item) => ({
          [item.name[0]]: item.value,
        }))
        .reduce((acc, item) => ({ ...acc, ...item }), {});
  
        debouncedQUpdate(changedFilterFields.q);
    };

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Restaurants" },
            ]}
          />
          {isFetching && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <TenantsFilter
            onFilterChange={(filterName: string, filterValue: string) => {
              console.log(filterName, filterValue);
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Add Tenant
            </Button>
          </TenantsFilter>
        </Form>
        <Table
          columns={columns}
          dataSource={tenants?.data}
          rowKey={"id"}
          pagination={{
            total: tenants?.total,
            pageSize: PER_PAGE,
            current: queryParam.currentPage,
            onChange: (page) => {
              setQueryParam((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]} - ${range[1]} of ${total} items`;
            },
          }}
        />

        <Drawer
          title="Create tenant"
          width={720}
          destroyOnClose={true}
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <TenantForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
