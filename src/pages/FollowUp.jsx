import React from 'react';
import { Table } from 'antd';
import chrono from 'chrono-node';
import moment from 'moment';

const FollowUp = (props) => {
  const results = chrono.parse(props.data);
  const dates = results.map(result =>
    moment(result.start.date()).format('DD MMM YY, hh:mm a') +
      (result.end ? ` - ${moment(result.end.date()).format('hh:mm a')}` : ''));

  return (
    <Table
      pagination={{ hideOnSinglePage: true }}
      dataSource={[...new Set(dates)].map(date => ({ date }))}
      rowKey="date"
      columns={[
        { title: 'Date', dataIndex: 'date' },
        {
          title: 'Action',
          render: obj => (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`mailto:riwu@gs.com?subject=${encodeURIComponent(`Meeting on ${obj.date}`)}`}
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
