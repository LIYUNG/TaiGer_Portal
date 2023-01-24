import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { BsExclamationTriangle, BsX } from 'react-icons/bs';

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
