import React from 'react';
import { Card, List } from 'antd';

const data = ['Transcript 1', 'Transcript 2'];

/* eslint-disable */
const Recommendation = () => (
  <div>
    <Card title="Previous transcript">
      <a>28 June meeting at Mapletree Anson</a>
    </Card>
    <Card title="Recommended transcripts" style={{ marginTop: '20px' }}>
      <List
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <a>{item}</a>
          </List.Item>
        )}
      />
    </Card>
  </div>
);

export default Recommendation;
