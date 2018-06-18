import React from 'react';
import { Table } from 'antd';
import { getClassification } from '../actions/api';

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
        pagination={{ hideOnSinglePage: true }}
        dataSource={this.state.categories}
        rowKey="name"
        columns={[
          { title: 'Category', dataIndex: 'name' },
          { title: 'Confidence', dataIndex: 'confidence' },
        ]}
      />
    );
  }
}

export default Classification;
