import React from 'react';
import { Input, List, Icon } from 'antd';
import queryString from 'query-string';
import Filter from '../components/Filter';
import styles from './SearchResult.module.css';
import transcripts from '../data/transcripts';

const teams = [
  {
    name: 'Team D',
    relevance: 74.2,
    description: 'Specialises in web development tools, build and deployment processes.',
    stars: 53,
    membersCount: 14,
  },
  {
    name: 'Team G',
    relevance: 61.5,
    description: 'Speciailises in developing Java Spring and Jersey libraries.',
    stars: 32,
    membersCount: 11,
  },
  {
    name: 'Team A',
    relevance: 57.4,
    description: 'Responsible for developing React UI Toolkit.',
    stars: 45,
    membersCount: 13,
  },
  {
    name: 'Team B',
    relevance: 54.1,
    description: 'Responsible for developing Angular UI Toolkit.',
    stars: 21,
    membersCount: 6,
  },
];

const IconText = ({
  type, text, onClick, active,
}) => (
  <span onClick={onClick}>
    <Icon type={type} className={`${active ? styles.active : ''} ${styles.icon}`} />
    <span className={`${active ? styles.active : ''} ${styles.iconText}`}>{text}</span>
  </span>
);

class SearchResult extends React.Component {
  state = {
    data: transcripts,
    showArticles: true,
  };
  render() {
    const { props } = this;
    return (
      <div className={styles.container}>
        <Input.Search enterButton defaultValue={queryString.parse(props.location.search).q} />
        <div className={styles.filterRow}>
          <span className={styles.resultCount}>
            About {this.state.data.length} filtered results
          </span>
          <Filter
            className={styles.filterButton}
            onFilter={() => this.setState({ showArticles: false, data: teams })}
          />
        </div>
        <List
          itemLayout="vertical"
          dataSource={this.state.data}
          renderItem={(item, i) => {
            if (!this.state.showArticles) {
              return (
                <List.Item
                  actions={[
                    { type: 'star-o', key: 'stars' },
                    { type: 'contacts', key: 'membersCount' },
                  ].map((action) => {
                    const userVoted = `${action.key}*`; // hacky
                    return (
                      <IconText
                        {...action}
                        text={item[action.key] + (item[userVoted] ? 1 : 0)}
                        active={item[userVoted]}
                        onClick={() =>
                          this.setState((prevState) => {
                            const data = prevState.data.slice();
                            data[i] = {
                              ...data[i],
                              [userVoted]: !item[userVoted],
                            };
                            return { data };
                          })
                        }
                      />
                    );
                  })}
                >
                  {}
                  <List.Item.Meta
                    title={
                      // eslint-disable-next-line jsx-a11y/anchor-is-valid
                      <a>{item.name}</a>
                    }
                    description={`Relevance: ${item.relevance}%`}
                  />
                  {item.description}
                </List.Item>
              );
            }
            return (
              <List.Item
                actions={[
                  { type: 'star-o', key: 'stars' },
                  { type: 'like-o', key: 'likes' },
                  { type: 'dislike-o', key: 'dislikes' },
                  { type: 'message', key: 'message' },
                ].map((action) => {
                  const userVoted = `${action.key}*`; // hacky
                  return (
                    <IconText
                      {...action}
                      text={item[action.key] + (item[userVoted] ? 1 : 0)}
                      active={item[userVoted]}
                      onClick={() =>
                        this.setState((prevState) => {
                          const data = prevState.data.slice();
                          data[i] = {
                            ...data[i],
                            [userVoted]: !item[userVoted],
                          };
                          return { data };
                        })
                      }
                    />
                  );
                })}
              >
                <List.Item.Meta
                  title={
                    <a target="_blank" rel="noopener noreferrer" href={item.link}>
                      {item.title}
                    </a>
                  }
                  description={`${item.date} - ${item.author}`}
                />
                {item.description}
              </List.Item>
            );
          }}
        />
      </div>
    );
  }
}

export default SearchResult;
