import React from 'react';
import { Input, Button, Tabs } from 'antd';
import SpeechRecognition from '../components/SpeechRecognition';
import Translation from '../components/Translation';
import Classification from './Classification';
import Summarization from './Summarization';
import FollowUp from './FollowUp';
import styles from './Home.module.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interimTranscript: '',
      transcript: '',
      finalTranscript: '',
    };
    this.setFinalTranscript = this.setFinalTranscript.bind(this);
  }
  setFinalTranscript() {
    this.setState(prevState => ({ finalTranscript: prevState.transcript, interimTranscript: '' }));
  }
  render() {
    return (
      <div className={styles.container}>
        <SpeechRecognition
          onReset={() => this.setState({ transcript: '', interimTranscript: '' })}
          onChange={(transcript, isFinal) =>
            this.setState((prevState) => {
              if (isFinal) {
                return {
                  transcript: `${prevState.transcript}${transcript}. `,
                  interimTranscript: '',
                };
              }
              return {
                interimTranscript: transcript,
              };
            })
          }
          onStop={this.setFinalTranscript}
        />
        <div className={styles.component}>
          <h3>Transcription</h3>
          <Input.TextArea
            autosize
            value={this.state.transcript + this.state.interimTranscript}
            onChange={e => this.setState({ transcript: e.target.value })}
          />
          <Button className={styles.submitButton} type="primary" onClick={this.setFinalTranscript}>
            Submit
          </Button>
        </div>
        <Translation
          className={`${styles.translation} ${styles.component}`}
          data={this.state.transcript}
        />

        <Tabs onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
          {[
            { Component: Classification, label: 'Topics' },
            { Component: Summarization, label: 'Summarization' },
            { Component: FollowUp, label: 'Follow-up' },
          ].map(tab => (
            <Tabs.TabPane tab={tab.label} key={tab.label} forceRender>
              <tab.Component data={this.state.finalTranscript} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default App;
