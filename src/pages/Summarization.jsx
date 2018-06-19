import React from 'react';
import { getSummarization } from '../actions/api';

class Summarization extends React.Component {
  state = {
    summary: '',
  };
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      getSummarization(this.props.data).then(data => this.setState({ summary: data.result }));
    }
  }
  render() {
    return <div>{this.state.summary}</div>;
  }
}

export default Summarization;
