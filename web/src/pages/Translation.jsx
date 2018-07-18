import React from 'react';
import { Select } from 'antd';
import { getTranslation } from '../actions/api';
import languages from '../data/languages.json';

const getTranslatingLanguages = transcriptLanguage =>
  Object.entries(languages).filter(([code]) => code !== transcriptLanguage);

class Translation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: getTranslatingLanguages(props.transcriptLanguage)[0][0],
      translations: {},
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.transcriptLanguage !== state.selectedLanguage) {
      return null;
    }
    return {
      selectedLanguage: getTranslatingLanguages(props.transcriptLanguage)[0][0],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data && this.props.data) {
      Object.keys(languages).forEach(code =>
        getTranslation(this.props.data, code).then((translation) => {
          this.setState(({ translations }) => ({
            translations: {
              ...translations,
              [code]: translation,
            },
          }));
        }));
    }
  }

  render() {
    const translatingLanguages = getTranslatingLanguages(this.props.transcriptLanguage);
    return (
      <React.Fragment>
        {this.props.data &&
          (this.state.translations[this.state.selectedLanguage] || '')
            .split('<br>')
            .map((row, i) => <div key={i}>{row}</div>)}
        <br />
        <Select
          value={this.state.selectedLanguage}
          onChange={code => this.setState({ selectedLanguage: code })}
        >
          {translatingLanguages.map(([code, label]) => (
            <Select.Option key={code}>{label}</Select.Option>
          ))}
        </Select>
      </React.Fragment>
    );
  }
}

export default Translation;
