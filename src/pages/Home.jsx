import React from 'react';
import { Input, Button, Tabs, Card } from 'antd';
import MeetingDetails from '../components/MeetingDetails';
import SpeechRecognition from '../components/SpeechRecognition';
import Translation from '../components/Translation';
import Classification from './Classification';
import Summarization from './Summarization';
import FollowUp from './FollowUp';
import Recommendation from './Recommendation';
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
        <MeetingDetails className={styles.meetingDetails} />
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
        <Card title="Transcription" className={styles.component}>
          <Input.TextArea
            autosize
            value={this.state.transcript + this.state.interimTranscript}
            onChange={e => this.setState({ transcript: e.target.value })}
          />
          <Button className={styles.submitButton} type="primary" onClick={this.setFinalTranscript}>
            Submit
          </Button>
        </Card>
        <Translation
          className={`${styles.translation} ${styles.component}`}
          data={this.state.transcript}
        />

        <Card>
          <Tabs mode="horizontal">
            {[
              { Component: Classification, label: 'Topics' },
              { Component: Summarization, label: 'Summarization' },
              { Component: FollowUp, label: 'Follow-up' },
              { Component: Recommendation, label: 'Recommendation' },
            ].map(tab => (
              <Tabs.TabPane tab={tab.label} key={tab.label} forceRender>
                <tab.Component data={this.state.finalTranscript} />
              </Tabs.TabPane>
            ))}
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default App;
