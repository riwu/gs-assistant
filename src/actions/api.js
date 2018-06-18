import axios from 'axios';

const [post] = ['post'].map(method => (path, data) =>
  axios({
    method,
    url: path,
    data,
  }).then(response => response.data));

const GOOGLE_API_KEY_PARAM = `?key=${process.env.REACT_APP_GOOGLE_API_KEY}`;

export const getEntities = content =>
  post(`https://language.googleapis.com/v1beta2/documents:analyzeEntities${GOOGLE_API_KEY_PARAM}`, {
    document: {
      type: 'PLAIN_TEXT',
      content,
    },
  });

export const getClassification = content =>
  post(`https://language.googleapis.com/v1beta2/documents:classifyText${GOOGLE_API_KEY_PARAM}`, {
    document: {
      type: 'PLAIN_TEXT',
      content,
    },
  });

export const getTranslation = (content, languageCode) =>
  post(`https://translation.googleapis.com/language/translate/v2${GOOGLE_API_KEY_PARAM}&target=${languageCode}&q=${encodeURIComponent(content)}`);

export const speechToText = content =>
  post(`https://speech.googleapis.com/v1/speech:recognize${GOOGLE_API_KEY_PARAM}`, {
    config: {
      encoding: 'AMR',
      sampleRateHertz: 8000,
      languageCode: 'en-US',
    },
    audio: { content },
  });

export const getSummarization = text =>
  post(`https://api.meaningcloud.com/summarization-1.0?key=${
    process.env.SUMMARIZATION_KEY
  }&sentences=2&txt=${encodeURIComponent(text)}`);
