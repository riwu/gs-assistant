import React from 'react';
import { Card } from 'antd';

const MeetingDetails = props => (
  <Card title="Description" className={props.className}>
    <b>Title:</b> Singapore Technology Internship Group Project Presentation 2018<br />
    <b>Date:</b> Thu, 5 July 3pm - 4.15pm<br />
    <b>Location:</b> Mapletree Anson Level 14 MP1<br />
    <b>Members:</b> Ding Jin, Sheng Yu, Grace Ting, Jeremy Ow, Wang Riwu
  </Card>
);

export default MeetingDetails;
