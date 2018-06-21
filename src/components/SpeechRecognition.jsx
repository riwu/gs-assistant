import React from 'react';
import { Button } from 'antd';
import styles from './SpeechRecognition.module.css';

const BrowserSpeechRecognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition);

const recognition = new BrowserSpeechRecognition();
recognition.lang = 'en-GB';
recognition.interimResults = true;

class SpeechRecognition extends React.Component {
  state = {
    started: false,
    command: '',
  };

  componentDidMount() {
    recognition.start();

    recognition.onresult = (event) => {
      let results = '';
      for (const result of event.results) {
        results += result[0].transcript;
      }

      console.log('results', results, event.results[0].isFinal);

      if (!event.results[0].isFinal) {
        if (this.state.started) {
          this.props.onChange(results, false);
        }
        return;
      }

      if (!this.state.started) {
        this.setVoiceCommand(results);
      }

      if (results.includes('start recording')) {
        console.log('start recording');
        this.setState({ started: true });
        this.setVoiceCommand(results);
      } else if (results.includes('stop recording')) {
        console.log('stopping');
        this.setState({ started: false });
        this.setVoiceCommand(results);
        this.props.onStop();
      } else if (results.includes('reset recording')) {
        console.log('resetting');
        this.setVoiceCommand(results);
        this.props.onReset();
      } else if (this.state.started) {
        this.props.onChange(results, true);
      }
    };

    recognition.onend = () => {
      recognition.start();
    };
  }

  setVoiceCommand = (command) => {
    this.setState({ command });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({ command: '' }), 1900);
  };
  render() {
    return (
      <div>
        <Button
          style={{ color: this.state.started ? 'red' : 'green' }}
          size="large"
          icon={this.state.started ? 'close-circle' : 'play-circle'}
          onClick={() => {
            if (this.state.started) {
              this.props.onStop();
            }
            this.setState(prevState => ({ started: !prevState.started }));
          }}
        >
          {this.state.started ? 'Stop recording' : 'Start recording'}
        </Button>
        {this.state.command && (
          <span className={styles.commandText}>Received voice command: {this.state.command}</span>
        )}
      </div>
    );
  }
}

export default SpeechRecognition;
