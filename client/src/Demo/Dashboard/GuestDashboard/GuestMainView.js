import React from "react";
import { Table } from "react-bootstrap";
import GuestMyself from "./GuestMyself";
import GuestDashboard from "./GuestDashboard";

class GuestMainView extends React.Component {
  render() {
    return (
      <>
        <GuestDashboard />
      </>
    );
  }
}

export default GuestMainView;
