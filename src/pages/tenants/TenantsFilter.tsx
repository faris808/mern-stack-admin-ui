import { Card, Col, Form, Input, Row } from "antd";
type UserFilterProps = {
  children?: React.ReactNode;
  onFilterChange: (filterName: string, filterValue: string) => void;
};
const TenantsFilter = ({ children }: UserFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={18}>
          <Row>
            <Col span={12}>
              <Form.Item name="q">
                <Input.Search placeholder="Search" allowClear={true} />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={6} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default TenantsFilter;
