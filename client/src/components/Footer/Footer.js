import React, { useEffect } from 'react';
import { Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function Footer(props) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const { i18n } = useTranslation();

  const handleOnChange = (e) => {
    console.log(e.target.lang);
    if (e.target.lang === 'en' || e.target.lang === 'zh-TW') {
      i18n.changeLanguage(e.target.lang);
      localStorage.setItem('locale', e.target.lang);
    } else {
      i18n.changeLanguage('en');
      localStorage.setItem('locale', e.target.lang);
    }
  };

  return (
    <footer
      style={{
        display: 'flex',
        flexDirection: 'column', // Set flex direction to column
        padding: 0,
        backgroundColor: '#000000'
      }}
    >
      <ul
        onClick={handleOnChange}
        className="my-1 py-0"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          listStyle: 'none', // Corrected property name
          padding: '2px'
        }}
      >
        <li className="text-light">
          <b>Language &nbsp;</b>
        </li>
        <li lang="en" className="text-light" style={{ cursor: 'pointer' }}>
          English
        </li>
        <li className="text-light">&nbsp;|&nbsp;</li>
        <li lang="zh-TW" className="text-light" style={{ cursor: 'pointer' }}>
          中文
        </li>
      </ul>
      <p
        className="mb-1 text-light"
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '12px'
        }}
      >
        Copyright TaiGer Consultancy © {currentYear} | Designed and developed by
        &nbsp;
        <a href="https://taigerconsultancy.com/" className="text-info">
          TaiGer Consultancy 台德留學顧問
        </a>
      </p>{' '}
    </footer>
  );
}
