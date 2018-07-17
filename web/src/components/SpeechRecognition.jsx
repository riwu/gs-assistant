import React from 'react';
import { Button } from 'antd';
import io from 'socket.io-client';
import styles from './SpeechRecognition.module.css';
import { BASE_URL } from '../actions/api';

const socket = io(BASE_URL);

socket.on('connect', () => {
  console.log('Socket connection established');
});

socket.on('disconnect', () => {
  console.log('Socket connection lost');
});

const synth = window.speechSynthesis;
let utter;
if (synth) {
  utter = new SpeechSynthesisUtterance();
  window.speechSynthesis.onvoiceschanged = () => {
    synth.getVoices().forEach((voice) => {
      if (voice.name === 'Google US English') {
        utter.voice = voice;
      }
    });
  };
}

const BrowserSpeechRecognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition);

let recognition;
if (BrowserSpeechRecognition) {
  recognition = new BrowserSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
}

class SpeechRecognition extends React.Component {
  state = {
    started: false,
    command: '',
  };

  componentDidMount() {
    socket.on('message', (msg, isFinal) => {
      this.props.onChange(msg, isFinal);
    });

    if (!recognition) return;

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

      if (!this.props.voiceCommand) {
        if (this.state.started) {
          socket.send(results, true);
          this.props.onChange(results, true);
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

    if (isValid && utter) {
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
    const width =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    return (
      <React.Fragment>
        <Button
          style={{ color: this.state.started ? 'red' : 'green' }}
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
        {this.state.command &&
          width > 768 && (
            <span className={styles.commandText}>Received voice command: {this.state.command}</span>
          )}
      </React.Fragment>
    );
  }
}

export default SpeechRecognition;
