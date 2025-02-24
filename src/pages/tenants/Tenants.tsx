import { Breadcrumb, Button, Drawer, Form, Space, Table } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getTenants } from "../../http/api";
import { useAuthStore } from "../../store";
import React from "react";
import TenantsFilter from "./TenantsFilter";
import TenantForm from "./forms/TenantForm";
import { CreateTenantData } from "../../types";

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
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const {
    data: tenants,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants().then((res) => res.data);
    },
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

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Restaurants" },
          ]}
        />
        {isLoading && <div>Loading....</div>}
        {isError && <div>{error.message}</div>}
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
        <Table columns={columns} dataSource={tenants} rowKey={"id"} />

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
