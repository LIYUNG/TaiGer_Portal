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
    <p></p>
    <p>
      {FILE_OK_SYMBOL}: The document is valid and can be used in the
      application.
    </p>
    <p>
      {FILE_NOT_OK_SYMBOL}: The document is invalud and cannot be used in the
      application. Please properly scan a new one.
    </p>
    <p>
      {FILE_UPLOADED_SYMBOL}: The document is uploaded. Your agent will check it
      as soon as possible.
    </p>
    <p>{FILE_MISSING_SYMBOL}: Please upload the copy of the document.</p>
    <p>{FILE_DONT_CARE_SYMBOL}: This document is not needed.</p>
  </>
);
