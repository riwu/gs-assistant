import React from 'react';
import { Card, Table } from 'antd';
import transcripts from '../data/transcripts';

/* eslint-disable */
const Recommendation = () => (
  <div>
    <Card title="Previous transcript">
      <a>Thu, 19 July 3pm - 4.15pm: Intern Group Project Dry Run</a>
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
          { title: 'Author', dataIndex: 'author' },
          { title: 'Date', dataIndex: 'date' },
          { title: 'Stars', dataIndex: 'stars' },
        ]}
      />
    </Card>
  </div>
);

export default Recommendation;
