import axios from 'axios';

export const BASE_URL =
  process.env.NODE_ENV === 'development2' ? 'http://localhost:3000' : process.env.REACT_APP_API_URL;

const [post] = ['post'].map(method => (path, data, options) =>
  axios({
    method,
    url: path,
    data,
    ...options,
  }).then(response => response.data));

const GOOGLE_API_KEY_PARAM = `?key=${process.env.REACT_APP_GOOGLE_API_KEY}`;

export const getClassification = content =>
  post(`https://language.googleapis.com/v1beta2/documents:classifyText${GOOGLE_API_KEY_PARAM}`, {
    document: {
      type: 'PLAIN_TEXT',
      content,
    },
  }).then(({ categories }) =>
    categories.map(category => ({
      ...category,
      name: category.name
        .slice(1) // remove leading /
        .split('/')
        .slice(-2) // only use last 2 level
        .join('/'),
    })));

const getGoogleTranslation = (content, languageCode) =>
  post(`https://translation.googleapis.com/language/translate/v2${GOOGLE_API_KEY_PARAM}&target=${languageCode}&q=${encodeURIComponent(content)}`);

let canAccessGoogleTranslate = false;
getGoogleTranslation('test', 'zh-CN').then(() => {
  console.log('Can access google translate');
  canAccessGoogleTranslate = true;
});

export const getTranslation = (content, languageCode) => {
  console.log('content', content);
  const formattedContent = content.replace(/\n/g, '<br>');
  const response = canAccessGoogleTranslate
    ? getGoogleTranslation(formattedContent, languageCode)
    : post(`${BASE_URL}/translate`, { content: formattedContent, languageCode });
  return response.then(({ data }) => (((data || {}).translations || [])[0] || {}).translatedText || '');
};

export const getSummarization = text =>
  post('https://api.algorithmia.com/v1/web/algo/nlp/Summarizer/0.1.7', text, {
    headers: {
      Authorization: process.env.REACT_APP_SUMMARIZATION_KEY,
      'Content-Type': 'text/plain',
    },
  });

if (process.env.NODE_ENV !== 'development') {
  post(process.env.REACT_APP_SESSION_URL, {
    page: window.location.href,
    referrer: 'GS Assistant Web',
  });
}
