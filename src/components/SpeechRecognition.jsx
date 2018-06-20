import React from 'react';
import { Button } from 'antd';

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
        this.setState({ command: results });
      }

      if (results.includes('start recording')) {
        console.log('start recording');
        this.setState({ started: true, command: results });
      } else if (results.includes('stop recording')) {
        console.log('stopping');
        this.setState({ started: false, command: results });
        this.props.onStop();
      } else if (results.includes('reset recording')) {
        console.log('resetting');
        this.setState({ command: results });
        this.props.onReset();
      } else if (this.state.started) {
        this.props.onChange(results, true);
      }
    };

    recognition.onend = () => {
      recognition.start();
    };
  }
  render() {
    return (
      <div>
        <Button
          onClick={() => {
            if (this.state.started) {
              this.props.onStop();
            }
            this.setState(prevState => ({ started: !prevState.started }));
          }}
        >
          {this.state.started ? 'Stop' : 'Start'}
        </Button>
        <div>Received voice command: {this.state.command}</div>
      </div>
    );
  }
}

export default SpeechRecognition;
