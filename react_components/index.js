import React from "react";
import "./styles/styles.scss";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import Product from "./product";
export default class App extends React.Component {
  state = {
    isLoading: true,
    products: [],
    page: 1,
    sort: "size",
    lastAdUrl: "",
    preemtive: [],
  };
  sort = (e) => {
    if (e.target.value == "id") {
      this.state.products.sort((x, y) =>
        x[e.target.value].localeCompare(y[e.target.value])
      );
    } else {
      this.state.products.sort((x, y) => x[e.target.value] - y[e.target.value]);
    }
    this.state.sort = e.target.value;
    this.forceUpdate();
  };

  onScroll = () => {
    const wrappedElement = document.getElementById("root");
    if (wrappedElement.getBoundingClientRect().bottom <= window.innerHeight) {
      console.log("assaas");
      window.removeEventListener("scroll", this.onScroll);
      this.componentDidMount();
    }
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }
  componentDidMount = () => {
    this.setState({
      isLoading: true,
      products: this.state.products.concat(this.state.preemtive),
    });
    if (!this.state.isEmpty)
      Axios.get(
        `/api/products?_page=${this.state.page}&_limit=${20}&_sort=${
          this.state.sort
        }`
      ).then(({ data }) => {
        if (data.length == 0) {
          this.setState({ isEmpty: true, isLoading: false });
          return;
        }
        if (this.state.products.length <= 0) {
          this.setState(
            {
              products: this.state.products.concat(data),
              page: this.state.page + 1,
              isLoading: false,
            },
            () => {
              window.addEventListener("scroll", this.onScroll);
            }
          );
          this.componentDidMount();
        } else {
          this.setState(
            {
              isLoading: false,
              preemtive: data,
              page: this.state.page + 1,
            },
            () => {
              window.addEventListener("scroll", this.onScroll);
            }
          );
        }
      });
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">
            <h2>Products</h2>
          </div>
          <div className="col-md-2">
            <h2 style={{ textAlign: "right" }}>Sort By:</h2>
          </div>
          <div className="col-md-1">
            <select
              onChange={this.sort}
              style={{ padding: 10, marginTop: 20, width: "100%" }}
            >
              <option>size</option>
              <option>price</option>
              <option>id</option>
            </select>
          </div>
        </div>
        {this.state.products.map((product, i) => (
          <>
            {i % 20 == 0 && i != 0 && (
              <div
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#ecf0f1",
                  padding: 20,
                }}
              >
                <h4>But first, a word from our sponsors:</h4>
                <img
                  classname="ad"
                  src={`/ads/?r=${Math.floor(Math.random() * 1000)}`}
                />
              </div>
            )}
            <Product id={i} product={product} />
          </>
        ))}
        {this.state.isLoading && (
          <h2 style={{ textAlign: "center" }}>Loading..</h2>
        )}
        {this.state.isEmpty && (
          <h2 style={{ textAlign: "center" }}>~ end of catalogue ~</h2>
        )}
      </div>
    );
  }
}
