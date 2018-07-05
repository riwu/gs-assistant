import React from 'react';
import { Input, List, Icon } from 'antd';
import queryString from 'query-string';
import Filter from '../components/Filter';
import styles from './SearchResult.module.css';
import transcripts from './transcripts';

const IconText = ({
  type, text, onClick, active,
}) => (
  <span onClick={onClick}>
    <Icon type={type} className={`${active ? styles.active : ''} ${styles.icon}`} />
    <span className={active ? styles.active : null}>{text}</span>
  </span>
);

class SearchResult extends React.Component {
  state = {
    data: transcripts,
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
          <Filter className={styles.filterButton} />
        </div>
        <List
          itemLayout="vertical"
          dataSource={this.state.data}
          renderItem={(item, i) => (
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
          )}
        />
      </div>
    );
  }
}

export default SearchResult;
