import React from 'react';

export default function Footer(props) {
  return (
    <footer
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '2px',
        backgroundColor: '#000000'
      }}
    >
      <p
        className="my-1 text-light"
        style={{
          fontSize: '12px'
        }}
      >
        Copyright TaiGer Consultancy © 2023 | Designed and developed by{' '}
        <a href="https://taigerconsultancy.com/" className="text-info">
          TaiGer Consultancy
        </a>
      </p>
    </footer>
  );
}
