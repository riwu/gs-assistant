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
  };
  componentDidMount() {
    recognition.onresult = (event) => {
      let results = '';
      for (const result of event.results) {
        results += result[0].transcript;
      }

      console.log('results', results, event.results[0].isFinal);

      if (!event.results[0].isFinal) {
        this.props.onChange(results, false);
        return;
      }

      if (results.includes('stop recording')) {
        console.log('stopping');
        this.setState({ started: false });
        this.started = false;
        recognition.stop();
      } else if (results.includes('reset recording')) {
        console.log('resetting');
        this.props.onReset();
      } else {
        this.props.onChange(results, true);
      }
    };

    recognition.onend = () => {
      console.log('ended', this.started);
      if (this.started) {
        recognition.start();
      } else {
        this.props.onStop();
      }
    };
  }
  render() {
    return (
      <Button
        onClick={() => {
          if (this.state.started) {
            recognition.stop();
          } else {
            recognition.start();
          }
          this.started = !this.started;
          this.setState(prevState => ({ started: !prevState.started }));
        }}
      >
        {this.state.started ? 'Stop' : 'Start'}
      </Button>
    );
  }
}

export default SpeechRecognition;
