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
  componentDidUpdate(prevProps, prevState) {
    if (
      (prevProps.data !== this.props.data ||
        prevState.selectedLanguage !== this.state.selectedLanguage) &&
      this.props.data
    ) {
      const code = this.state.selectedLanguage;
      getTranslation(this.props.data, code).then(({ data }) => {
        this.setState(({ translations }) => ({
          translations: {
            ...translations,
            [code]: (((data || {}).translations || [])[0] || {}).translatedText,
          },
        }));
      });
    }
  }
  render() {
    return (
      <div>
        <Select
          defaultValue={LANGUAGES[0].code}
          onChange={code => this.setState({ selectedLanguage: code })}
        >
          {LANGUAGES.map(language => (
            <Select.Option key={language.code}>{language.label}</Select.Option>
          ))}
        </Select>
        <div>{this.state.translations[this.state.selectedLanguage]}</div>
      </div>
    );
  }
}

export default Translation;