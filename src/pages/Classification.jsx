import React from 'react';
import { Table } from 'antd';
import { getClassification } from '../actions/api';

const relevantTopics = [
  { topic: '/News/Economic Times', relevance: 0.6 },
  { topic: 'PNB Fraud', relevance: 0.3 },
];

const topics = {
  '/Finance/Banking': relevantTopics,
};

class Classification extends React.Component {
  state = {
    categories: [],
  };
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      getClassification(this.props.data).then(data =>
        this.setState({ categories: data.categories }));
    }
  }
  render() {
    return (
      <Table
        expandRowByClick
        expandedRowRender={selectedRow => (
          <Table
            pagination={{ hideOnSinglePage: true }}
            dataSource={topics[selectedRow.name] || relevantTopics}
            rowKey="name"
            columns={[
                { title: 'Similar Topics', render: row => <a>{row.topic}</a> },
                { title: 'Relevance', dataIndex: 'relevance' },
              ]}
          />
          )}
        pagination={{ hideOnSinglePage: true }}
        dataSource={this.state.categories}
        rowKey="name"
        columns={[
          { title: 'Category', render: row => <a>{row.name}</a> },
          { title: 'Confidence', dataIndex: 'confidence' },
        ]}
      />
    );
  }
}

export default Classification;
