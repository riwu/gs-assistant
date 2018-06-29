import React from 'react';
import { Input, List, Icon } from 'antd';
import queryString from 'query-string';
import Filter from '../components/Filter';
import styles from './SearchResult.module.css';

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
    data: [
      {
        title: 'ReactJS',
        subtitle: '29 May 2018 - Jeremy Ow',
        description: `React makes it painless to create interactive UIs.
          Design simple views for each state in your application,
          and React will efficiently update and render just the right components when your data changes.`,
        stars: 43,
        likes: 166,
        dislikes: 5,
        message: 7,
        link: 'https://reactjs.org/',
      },
      {
        title: 'AngularJS',
        subtitle: '5 June 2018 - Grace Ting',
        description: `HTML is great for declaring static documents,
        but it falters when we try to use it for declaring dynamic views in web-applications.
        AngularJS lets you extend HTML vocabulary for your application.
        The resulting environment is extraordinarily expressive, readable, and quick to develop.`,
        stars: 22,
        likes: 49,
        dislikes: 2,
        message: 3,
        link: 'https://angularjs.org/',
      },
    ],
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
                description={item.subtitle}
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
