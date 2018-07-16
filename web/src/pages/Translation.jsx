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
        getTranslation(this.props.data, code).then(({ data }) => {
          this.setState(({ translations }) => ({
            translations: {
              ...translations,
              [code]: (((data || {}).translations || [])[0] || {}).translatedText,
            },
          }));
        }));
    }
  }
  render() {
    return (
      <React.Fragment>
        <div>{this.props.data && this.state.translations[this.state.selectedLanguage]}</div>
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
