import React from 'react';
import { Card, Table } from 'antd';
import transcripts from './transcripts';

/* eslint-disable */
const Recommendation = () => (
  <div>
    <Card title="Previous transcript">
      <a>28 June meeting at Mapletree Anson</a>
    </Card>
    <Card title="Recommended transcripts" style={{ marginTop: '20px' }}>
      <Table
        pagination={{ hideOnSinglePage: true }}
        dataSource={transcripts}
        rowKey="title"
        columns={[
          {
            title: 'Title',
            dataIndex: 'title',
            render: title => <a>{title}</a>,
          },
          { title: 'Date', dataIndex: 'date' },
          { title: 'Stars', dataIndex: 'stars' },
        ]}
      />
    </Card>
  </div>
);

export default Recommendation;
