import React from 'react';
import { Button } from 'antd';
import io from 'socket.io-client';
import styles from './SpeechRecognition.module.css';

const socket = io(process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.REACT_APP_API_URL);

socket.on('connect', () => {
  console.log('Socket connection established');
});

socket.on('disconnect', () => {
  console.log('Socket connection lost');
});

const synth = window.speechSynthesis;
const utter = new SpeechSynthesisUtterance();
window.speechSynthesis.onvoiceschanged = () => {
  synth.getVoices().forEach((voice) => {
    if (voice.name === 'Google US English') {
      utter.voice = voice;
    }
  });
};

const BrowserSpeechRecognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition);

const recognition = new BrowserSpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = true;

class SpeechRecognition extends React.Component {
  state = {
    started: false,
    command: '',
  };

  componentDidMount() {
    socket.on('message', (msg, isFinal) => {
      this.props.onChange(msg, isFinal);
    });

    recognition.start();

    recognition.onresult = (event) => {
      let results = '';
      for (const result of event.results) {
        results += result[0].transcript;
      }

      console.log('results', results, event.results[0].isFinal);

      if (!event.results[0].isFinal) {
        if (this.state.started) {
          socket.send(results, false);
          this.props.onChange(results, false);
        }
        return;
      }

      const matchStartOrStopRecording = results.search(/(start|stop)s? recording/) > -1;
      if (matchStartOrStopRecording) {
        console.log('starting/stopping recording');
        if (this.state.started) {
          this.props.onStop();
        }
        this.setVoiceCommand(`recording ${this.state.started ? 'stopped' : 'started'}`, true);
        this.setState(prevState => ({ started: !prevState.started }));
      } else if (results.search('resets? recording') > -1) {
        console.log('resetting');
        this.setVoiceCommand('recording reset', true);
        this.props.onReset();
      } else if (this.state.started) {
        socket.send(results, true);
        this.props.onChange(results, true);
      } else {
        this.setVoiceCommand(results);
      }
    };

    recognition.onend = () => {
      if (!this.stopRecognition) {
        recognition.start();
      }
    };
  }

  setVoiceCommand = (command, isValid) => {
    this.setState({ command });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({ command: '' }), 3900);

    if (isValid) {
      utter.text = command;
      synth.speak(utter);
      this.stopRecognition = true;
      recognition.abort();
      utter.onend = () => {
        console.log('ended');
        this.stopRecognition = false;
        recognition.start();
      };
    }
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
