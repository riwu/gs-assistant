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
  recognition.interimResults = true;
}

class SpeechRecognition extends React.Component {
  state = {
    started: false,
    command: '',
  };

  componentDidMount() {
    socket.on('message', (...args) => {
      this.props.onChange(...args);
    });

    if (!recognition) return;

    recognition.lang = this.props.transcriptLanguage;

    if (this.props.voiceCommand) {
      recognition.start();
    }

    recognition.onresult = (event) => {
      let results = '';
      for (const result of event.results) {
        results += result[0].transcript;
      }

      console.log('results', results, event.results[0].isFinal);

      if (!event.results[0].isFinal) {
        if (this.state.started) {
          this.sendResults(results, false);
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
        this.sendResults(results, true);
      } else {
        this.setVoiceCommand(results);
      }
    };

    recognition.onend = () => {
      if (!this.stoppingRecognition) {
        recognition.start();
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (recognition) {
      recognition.lang = this.props.transcriptLanguage;
    }

    console.log(
      'Speech recog component updated',
      this.state.started,
      this.props.voiceCommand,
      prevProps.voiceCommand,
    );
    if (!this.state.started) {
      if (this.props.voiceCommand) {
        this.startRecognition();
      } else {
        this.stopRecognition();
      }
    }
  }

  setVoiceCommand = (command, isValid) => {
    this.setState({ command });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({ command: '' }), 3900);

    if (isValid && utter) {
      utter.text = command;
      synth.speak(utter);
      this.stopRecognition();
      utter.onend = () => {
        console.log('ended');
        this.startRecognition();
      };
    }
  };

  startRecognition() {
    this.stoppingRecognition = false;
    try {
      recognition.start();
    } catch (e) {
      console.log('Failed to start recognition', e);
    }
  }

  stopRecognition() {
    this.stoppingRecognition = true;
    recognition.stop();
  }

  sendResults(...args) {
    socket.send(...args, this.props.user);
    this.props.onChange(...args, this.props.user || undefined);
  }

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
            } else {
              this.startRecognition();
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
