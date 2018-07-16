import React from 'react';
import { Input, Button, Tabs, Card } from 'antd';
import MeetingDetails from './MeetingDetails';
import SpeechRecognition from '../components/SpeechRecognition';
import Translation from './Translation';
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
        <Card title="Transcription" className={styles.transcription}>
          <Input.TextArea
            autosize
            value={this.state.transcript + this.state.interimTranscript}
            onChange={e => this.setState({ transcript: e.target.value })}
          />
          <Button className={styles.submitButton} type="primary" onClick={this.setFinalTranscript}>
            Submit
          </Button>
        </Card>

        <Card>
          <Tabs mode="horizontal">
            {[
              { Component: MeetingDetails, label: 'Description' },
              { Component: Translation, label: 'Translation', data: this.state.transcript },
              { Component: Classification, label: 'Topics' },
              { Component: Summarization, label: 'Summarization' },
              { Component: Recommendation, label: 'Recommendation' },
              { Component: FollowUp, label: 'Follow-up' },
            ].map(tab => (
              <Tabs.TabPane tab={tab.label} key={tab.label} forceRender>
                <tab.Component
                  data={tab.data !== undefined ? tab.data : this.state.finalTranscript}
                />
              </Tabs.TabPane>
            ))}
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default App;
