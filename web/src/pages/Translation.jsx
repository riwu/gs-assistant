import React from 'react';
import { Select } from 'antd';
import { getTranslation } from '../actions/api';

const LANGUAGES = [
  { code: 'zh-CN', label: 'Chinese' },
  { code: 'ta', label: 'Tamil' },
  { code: 'hi', label: 'Hindi' },
];

class Translation extends React.Component {
  state = {
    selectedLanguage: LANGUAGES[0].code,
    translations: {},
  };
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data && this.props.data) {
      LANGUAGES.forEach(({ code }) =>
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
    return (
      <React.Fragment>
        {this.props.data &&
          (this.state.translations[this.state.selectedLanguage] || '')
            .split('<br>')
            .map((row, i) => <div key={i}>{row}</div>)}
        <br />
        <Select
          defaultValue={LANGUAGES[0].code}
          onChange={code => this.setState({ selectedLanguage: code })}
        >
          {LANGUAGES.map(language => (
            <Select.Option key={language.code}>{language.label}</Select.Option>
          ))}
        </Select>
      </React.Fragment>
    );
  }
}

export default Translation;
