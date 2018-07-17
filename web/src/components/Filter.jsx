import React from 'react';
import { Button, Collapse } from 'antd';
import styles from './Filter.module.css';

const rows = [
  {
    type: 'Articles',
    date: 'This week',
    department: 'Engineering',
    sort: 'Relevance',
  },
  {
    type: 'Teams',
    date: 'This month',
    department: 'Operations',
    sort: 'Date',
  },
  {
    type: '',
    date: 'This year',
    department: 'HCM',
    sort: 'Rating',
  },
];

class Filter extends React.Component {
  state = {
    expanded: false,
  };
  render() {
    return (
      <React.Fragment>
        <span>
          <Button
            className={this.props.className}
            icon="filter"
            onClick={() => this.setState(prevState => ({ expanded: !prevState.expanded }))}
          >
            Filter
          </Button>
        </span>
        <Collapse className={styles.collapse} activeKey={this.state.expanded ? 'panel' : null}>
          <Collapse.Panel showArrow={false} key="panel">
            <table className={styles.table}>
              <thead>
                <tr>
                  {['TYPE', 'DATE', 'DEPARTMENT', 'SORT BY'].map(col => (
                    <th key={col} className={`${styles.column} ${styles.th}`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.date}>
                    {Object.values(row).map(field => (
                      /* eslint-disable */
                      <td key={field} className={styles.column}>
                        {field === 'Articles' /* */ ? (
                          field
                        ) : (
                          <a
                            onClick={() => {
                              this.setState({ expanded: false });
                              this.props.onFilter();
                            }}
                          >
                            {field}
                          </a>
                        )}
                      </td>
                      /* eslint-enable */
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Collapse.Panel>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default Filter;
