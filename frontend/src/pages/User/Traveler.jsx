import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Divider, Row, Spin, Typography, Tag, Rate, message } from 'antd';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;

function Traveler() {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [destRes, pkgRes] = await Promise.all([
        axios.get('http://localhost:5000/api/destinations/getDestination'),
        axios.get('http://localhost:5000/api/packages/getAllPackages'),
      ]);

      setDestinations(destRes.data || []);
      setPackages(pkgRes.data || []);
    } catch (error) {
      console.error('Error fetching traveler data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRate = async (destinationId, value) => {
    if (!destinationId || !value) return;

    setSubmitting(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/destinations/${destinationId}/rate`, {
        rating: value,
      });

      setDestinations((prev) =>
        prev.map((item) => (item._id === destinationId ? res.data : item)),
      );
      message.success('Thank you for your rating!');
    } catch (error) {
      console.error('Error rating destination:', error);
      message.error('Unable to submit rating.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '32px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* <div style={{ background: 'linear-gradient(135deg, #005707 0%, #0f7a1b 100%)', borderRadius: '24px', padding: '36px', color: 'white' }}>
          <Title level={1} style={{ color: 'white', marginBottom: 8 }}>
            Welcome, Traveler
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', maxWidth: '700px' }}>
            Discover amazing destinations and exciting travel packages curated for your next adventure.
          </Paragraph>
          <Button type="primary" style={{ backgroundColor: '#ffffff', color: '#005707', border: 'none' }}>
            Explore Now
          </Button>
        </div> */}

        <Divider />

        <Title level={2} style={{ color: '#003705' }}>
          Popular Destinations
        </Title>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {destinations.map((destination) => (
              <Col xs={24} md={12} lg={8} key={destination._id}>
                <Card
                  cover={
                    destination.destinationImage ? (
                      <img
                        src={destination.destinationImage}
                        alt={destination.destination}
                        style={{ height: 220, objectFit: 'cover' }}
                      />
                    ) : null
                  }
                  hoverable
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ marginBottom: 4 }}>{destination.destination}</Title>
                    <Tag color="green">{destination.location}</Tag>
                  </div>
                  <Paragraph ellipsis={{ rows: 3 }} style={{ minHeight: 72 }}>
                    {destination.description || 'No description available.'}
                  </Paragraph>
                  <Text type="secondary">Rating: {destination.rating ?? 0}</Text>
                  <Divider style={{ margin: '12px 0' }} />
                  {/* <div>
                    <Text strong>Rate this destination</Text>
                    <div style={{ marginTop: 8 }}>
                      <Rate
                        allowHalf={false}
                        disabled={submitting}
                        onChange={(value) => handleRate(destination._id, value)}
                      />
                    </div>
                  </div> */}
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Divider />

        <Title level={2} style={{ color: '#003705' }}>
          Travel Packages
        </Title>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {packages.map((pkg) => (
              <Col xs={24} md={12} lg={8} key={pkg._id}>
                <Card hoverable>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ marginBottom: 4 }}>{pkg.packageName}</Title>
                    <Tag color="blue">{pkg.type}</Tag>
                  </div>
                  <Paragraph>{pkg.description}</Paragraph>
                  <Text strong>Duration: </Text>
                  <Text>{pkg.duration_days}</Text>
                  <br />
                  <Text strong>Price: </Text>
                  <Text>₱{Number(pkg.price || 0).toLocaleString()}</Text>
                  <br />
                  <Text strong>Destination: </Text>
                  <Text>{pkg.destination?.destination || 'N/A'}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default Traveler;