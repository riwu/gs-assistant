import React from 'react';
import { Input, List, Icon } from 'antd';
import queryString from 'query-string';
import Filter from '../components/Filter';
import styles from './SearchResult.module.css';

const data = [
  {
    title: 'ReactJS',
    subtitle: '29 May 2018 - Jeremy Ow',
    description: `React makes it painless to create interactive UIs.
      Design simple views for each state in your application,
      and React will efficiently update and render just the right components when your data changes.`,
    stars: 43,
    likes: 166,
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
    message: 3,
    link: 'https://angularjs.org/',
  },
];

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

const SearchResult = props => (
  <div className={styles.container}>
    <Input.Search enterButton defaultValue={queryString.parse(props.location.search).q} />
    <div className={styles.filterRow}>
      <span className={styles.resultCount}>About {data.length} filtered results</span>
      <Filter className={styles.filterButton} />
    </div>
    <List
      itemLayout="vertical"
      dataSource={data}
      renderItem={item => (
        <List.Item
          actions={[
            <IconText type="star-o" text={item.stars} />,
            <IconText type="like-o" text={item.likes} />,
            <IconText type="message" text={item.message} />,
          ]}
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

export default SearchResult;
