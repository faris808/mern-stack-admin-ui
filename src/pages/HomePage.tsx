import { Card, Col, Row, Typography } from "antd";
import { useAuthStore } from "../store";

const { Title } = Typography;

function HomePage() {
  const { user } = useAuthStore();
  return (
    <div>
      <Title level={4}>Welcome, {user?.firstName} 🤗</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Row gutter={16}>
            <Col span={12}>
              <Card>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{marginTop: '16px'}}>
            <Col span={24}>
              <Card>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={12} style={{ display: "flex", flexDirection: "column" }}>
          <Card style={{ flex: 1 }}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{marginTop: '16px'}}>
        <Col span={24}>
          <Card>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
