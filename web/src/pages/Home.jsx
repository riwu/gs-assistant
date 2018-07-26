import React from 'react';
import { Input, Button, Tabs, Card, Switch, Select } from 'antd';
import queryString from 'query-string';
import MeetingDetails from './MeetingDetails';
import SpeechRecognition from '../components/SpeechRecognition';
import Translation from './Translation';
import Classification from './Classification';
import Summarization from './Summarization';
import FollowUp from './FollowUp';
import Recommendation from './Recommendation';
import styles from './Home.module.css';
import languages from '../data/languages.json';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interimTranscript: '',
      transcript: '',
      user: null,
      finalTranscript: '',
      voiceCommand: false,
      transcriptLanguage: Object.keys(languages)[0],
    };
    this.setFinalTranscript = this.setFinalTranscript.bind(this);
  }
  setFinalTranscript() {
    this.setState(prevState => ({ finalTranscript: prevState.transcript, interimTranscript: '' }));
  }
  render() {
    return (
      <div className={styles.container}>
        <Card
          className={styles.transcription}
          title={
            <React.Fragment>
              <span>Transcription</span>
              <Select
                className={styles.select}
                value={this.state.transcriptLanguage}
                onChange={code => this.setState({ transcriptLanguage: code })}
              >
                {Object.entries(languages).map(([code, label]) => (
                  <Select.Option key={code}>{label}</Select.Option>
                ))}
              </Select>
              <SpeechRecognition
                transcriptLanguage={this.state.transcriptLanguage}
                user={queryString.parse(this.props.location.search).u}
                voiceCommand={this.state.voiceCommand}
                onReset={() => this.setState({ transcript: '', interimTranscript: '' })}
                onChange={(transcript, isFinal, user = 'Me') =>
                  this.setState((prevState) => {
                    console.log('user', prevState.user, user);
                    const newLine = prevState.transcript.trim() ? '\n' : '';
                    const userStr = prevState.user === user ? '' : `${newLine + user}: `;
                    if (isFinal || (prevState.user && user !== prevState.user)) {
                      return {
                        transcript: `${prevState.transcript + userStr + transcript}. `,
                        interimTranscript: '',
                        user,
                      };
                    }
                    return {
                      interimTranscript: userStr + transcript,
                    };
                  })
                }
                onStop={this.setFinalTranscript}
              />
              <Button
                className={styles.submitButton}
                type="primary"
                onClick={this.setFinalTranscript}
              >
                Submit
              </Button>
            </React.Fragment>
          }
        >
          <Input.TextArea
            autosize
            value={this.state.transcript + this.state.interimTranscript}
            onChange={e => this.setState({ transcript: e.target.value, interimTranscript: '' })}
          />
        </Card>
        <Card>
          <Tabs mode="horizontal">
            {[
              { Component: MeetingDetails, label: 'Description' },
              {
                Component: Translation,
                label: 'Translation',
                data: this.state.transcript,
                transcriptLanguage: this.state.transcriptLanguage,
              },
              { Component: Classification, label: 'Topics' },
              { Component: Summarization, label: 'Summarization' },
              { Component: Recommendation, label: 'Recommendation' },
              { Component: FollowUp, label: 'Follow-up' },
            ].map(({ label, Component, ...otherProps }) => (
              <Tabs.TabPane tab={label} key={label} forceRender>
                <Component data={this.state.finalTranscript} {...otherProps} />
              </Tabs.TabPane>
            ))}
          </Tabs>
        </Card>
        <div className={styles.voiceCommand}>
          <span className={styles.voiceCommandText}>Voice Command</span>
          <Switch
            className={styles.switch}
            defaultChecked={this.state.voiceCommand}
            onChange={checked => this.setState({ voiceCommand: checked })}
          />
        </div>
      </div>
    );
  }
}

export default App;
