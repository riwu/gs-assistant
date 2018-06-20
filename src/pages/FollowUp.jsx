import React from 'react';
import { Table } from 'antd';
import chrono from 'chrono-node';
import moment from 'moment';

const FollowUp = (props) => {
  const results = chrono.parse(props.data);
  const actions = results.map(result => ({
    date: moment(result.start.date()).format('DD MMM YY, hh:mm a'),
  }));

  return (
    <Table
      pagination={{ hideOnSinglePage: true }}
      dataSource={actions}
      rowKey="date"
      columns={[
        { title: 'Date', dataIndex: 'date' },
        {
          title: 'Action',
          render: obj => (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`mailto:riwu@gs.com?subject=${encodeURIComponent(`Meeting at ${obj.date}`)}`}
            >
              Setup meeting
            </a>
          ),
        },
      ]}
    />
  );
};

export default FollowUp;
