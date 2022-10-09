import React from 'react';
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime
} from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { BsDash } from 'react-icons/bs';
let FILE_OK_SYMBOL = (
  <IoCheckmarkCircle size={18} color="limegreen" title="Valid Document" />
);
let FILE_NOT_OK_SYMBOL = (
  <AiFillCloseCircle size={18} color="red" title="Invalid Document" />
);
let FILE_UPLOADED_SYMBOL = (
  <AiOutlineFieldTime size={18} color="orange" title="Uploaded successfully" />
);
let FILE_MISSING_SYMBOL = (
  <AiFillQuestionCircle
    size={18}
    color="lightgray"
    title="No Document uploaded"
  />
);
let FILE_DONT_CARE_SYMBOL = (
  <BsDash size={18} color="lightgray" title="Not needed" />
);
export const SYMBOL_EXPLANATION = (
  <>
    <p className="text-muted"> </p>
    <p className="text-info">
      {FILE_OK_SYMBOL}: The document is valid and can be used in the
      application.
    </p>
    <p className="text-info">
      {FILE_NOT_OK_SYMBOL}: The document is invalud and cannot be used in the
      application. Please properly scan a new one.
    </p>
    <p className="text-info">
      {FILE_UPLOADED_SYMBOL}: The document is uploaded. Your agent will check it
      as soon as possible.
    </p>
    <p className="text-info">
      {FILE_MISSING_SYMBOL}: Please upload the copy of the document.
    </p>
    <p className="text-info">
      {FILE_DONT_CARE_SYMBOL}: This document is not needed.
    </p>{' '}
  </>
);

export const convertDate = (date) => {
  let date_str = '';
  let dat = new Date(date).toLocaleDateString();
  let time = new Date(date).toLocaleTimeString();
  return dat + ', ' + time;
};

export const getNumberOfDays = (start, end) => {
  const date1 = new Date(start);
  const date2 = new Date(end);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays.toString();
};
