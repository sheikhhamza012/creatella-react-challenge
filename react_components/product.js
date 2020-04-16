import React, { Component } from "react";
export default class App extends Component {
  state = {};
  convertDate = (date) => {
    var now = new Date();
    var d = new Date(date);
    if (now.getFullYear() - d.getFullYear() <= 0) {
      if (now.getMonth() - d.getMonth() <= 0) {
        if (now.getDate() - d.getDate() <= 7) {
          if (now.getDate() - d.getDate() > 0)
            return now.getDate() - d.getDate() + " days ago";
          if (now.getHours() - d.getHours() > 0) {
            return now.getHours() - d.getHours() + " hours ago";
          }
          if (now.getMinutes() - d.getMinutes() > 0) {
            return now.getHours() - d.getHours() + " minutes ago";
          }
        }
      }
    }
    return date;
  };
  render() {
    const x = this.props.product;
    return (
      <div id={this.props.id} className={"grid-elem"}>
        <p className="tag">Product id: {x.id}</p>
        <div className="inner-grid-elem">
          <h2 style={{ fontSize: x.size }}>{x.face}</h2>
          <h2 style={{ fontSize: x.size }}>size:{x.size}</h2>
        </div>
        <p className="tag"> {this.convertDate(x.date)}</p>
        <h2 style={{ textAlign: "center" }}> ${x.price}</h2>
      </div>
    );
  }
}
