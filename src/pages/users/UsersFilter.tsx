import { Card, Col, Input, Row, Select } from "antd";
type UserFilterProps = {
  children? : React.ReactNode;
  onFilterChange: (filterName: string, filterValue: string) => void;
};
const UsersFilter = ({ onFilterChange, children }: UserFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Input.Search
                placeholder="Search"
                onChange={(e) =>
                  onFilterChange("searchFilter", e.target.value)
                }
                allowClear={true}
              />
            </Col>
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Select role"
                onChange={(selectedItem) =>
                  onFilterChange("roleFilter", selectedItem)
                }
                allowClear={true}
              >
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="manager">Manager</Select.Option>
                <Select.Option value="customer">Customer</Select.Option>
              </Select>
            </Col>
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Status"
                onChange={(selectedItem) =>
                  onFilterChange("statusFilter", selectedItem)
                }
                allowClear={true}
              >
                <Select.Option value="ban">Ban</Select.Option>
                <Select.Option value="active">Active</Select.Option>
              </Select>
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default UsersFilter;
