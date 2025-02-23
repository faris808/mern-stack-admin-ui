import { Card, Col, Input, Row } from "antd";
type UserFilterProps = {
  children? : React.ReactNode;
  onFilterChange: (filterName: string, filterValue: string) => void;
};
const TenantsFilter = ({ onFilterChange, children }: UserFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={18}>
          <Row>
            <Col span={12}>
              <Input.Search
                placeholder="Search"
                onChange={(e) =>
                  onFilterChange("searchFilter", e.target.value)
                }
                allowClear={true}
              />
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