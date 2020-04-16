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
    //sort mechanism: this will immediately sort products in state when the selection changes
    if (e.target.value == "id") {
      this.state.products.sort((x, y) =>
        x[e.target.value].localeCompare(y[e.target.value])
      );
    } else {
      this.state.products.sort((x, y) => x[e.target.value] - y[e.target.value]);
    }
    //this will change the value products will sort to, so when the next request goes it will send current sorting parameter
    this.state.sort = e.target.value;
    // will update the state as we are setting the state var manually
    this.forceUpdate();
  };

  onScroll = () => {
    // this checks when the bottom is viewed and so trigger the load mechanism
    const wrappedElement = document.getElementById("root");
    if (wrappedElement.getBoundingClientRect().bottom <= window.innerHeight) {
      console.log("assaas");
      window.removeEventListener("scroll", this.onScroll);
      //load mechanism is present in this lifecycle method
      this.componentDidMount();
    }
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }
  componentDidMount = () => {
    //pre emptive fetch is implemented in here

    // when this function is called it will push the products from pre emptive array to products array

    // when this method is initially called both arrays would be empty so they wont do any thing
    this.setState({
      isLoading: true,
      products: this.state.products.concat(this.state.preemtive),
    });
    //this request is sent to fetch data only if there hasnt been a previous request with no data
    if (!this.state.isEmpty)
      Axios.get(
        `/api/products?_page=${this.state.page}&_limit=${20}&_sort=${
          this.state.sort
        }`
      ).then(({ data }) => {
        //if request comes with no data set the empty flag so end of catalogue is shown and no more request is sent
        if (data.length == 0) {
          this.setState({ isEmpty: true, isLoading: false });
          return;
        }
        // if this is the first request of the app then save the data directly to products and add scroll listener to window
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
          //as this portion is run on first request of app send another request after populating products
          //to populate pre emptive array
          this.componentDidMount();
        } else {
          // if this isnt first request then just save comming data to preemptive everytime

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
              //if this is the 20th map we need to show ad

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
            {/* every poduct component "grid"*/}
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
