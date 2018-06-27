import React from 'react';
import { Button, Collapse } from 'antd';
import styles from './Filter.module.css';

const rows = [
  {
    date: 'This week',
    department: 'Engineering',
    location: 'Asia Pacific',
  },
  {
    date: 'This month',
    department: 'Operations',
    location: 'Americans',
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
                  {['DATE', 'DEPARTMENT', 'LOCATION'].map(col => (
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
                      <td key={field} className={styles.column}>
                        {field}
                      </td>
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
