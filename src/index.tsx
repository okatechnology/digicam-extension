import React from 'react';
import ReactDOM from 'react-dom';
import '../public/manifest.json';
import '../public/background';
import { BrowserBack } from './components/browserBack/BrowserBack';

const buttonRoot = document.createElement('div');
document.body.appendChild(buttonRoot);

const renderBrowserBack = () => {
  ReactDOM.render(<BrowserBack />, buttonRoot);
};

renderBrowserBack();
