import React from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { getClassification } from '../actions/api';

const relevantTopics = [
  { topic: 'News/Economic Times', relevance: 0.6 },
  { topic: 'PNB Fraud', relevance: 0.3 },
];

const topics = {
  'Finance/Banking': relevantTopics,
};

const SearchLink = ({ query }) => (
  <Link
    target="_blank"
    to={{
      pathname: '/search',
      search: `?q=${encodeURIComponent(query)}`,
    }}
    onClick={(e) => {
      e.stopPropagation();
    }}
  >
    {query}
  </Link>
);

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
            rowKey="topic"
            columns={[
              {
                title: 'Similar Topics',
                dataIndex: 'topic',
                render: topic => <SearchLink query={topic} />,
              }, // eslint-disable-line jsx-a11y/anchor-is-valid
              { title: 'Relevance', dataIndex: 'relevance' },
            ]}
          />
        )}
        pagination={{ hideOnSinglePage: true }}
        dataSource={this.state.categories}
        rowKey="name"
        columns={[
          {
            title: 'Category',
            dataIndex: 'name',
            render: name => <SearchLink query={name.slice(1)} />,
          }, // eslint-disable-line jsx-a11y/anchor-is-valid
          { title: 'Confidence', dataIndex: 'confidence' },
        ]}
      />
    );
  }
}

export default Classification;
