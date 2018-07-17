import React from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { getClassification } from '../actions/api';

const relevantTopics = [
  { topic: 'Front-end frameworks', relevance: 0.79 },
  { topic: 'Back-end frameworks', relevance: 0.79 },
  { topic: 'Javascript', relevance: 0.43 },
  { topic: 'RESTful API', relevance: 0.31 },
  { topic: 'Mobile responsive design', relevance: 0.25 },
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
      getClassification(this.props.data).then(categories => this.setState({ categories }));
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
            render: name => <SearchLink query={name} />,
          }, // eslint-disable-line jsx-a11y/anchor-is-valid
          { title: 'Confidence', dataIndex: 'confidence' },
        ]}
      />
    );
  }
}

export default Classification;
