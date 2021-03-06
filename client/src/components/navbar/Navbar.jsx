/** @format */

import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./navbar.styles.scss";
import { useHistory, useLocation } from "react-router-dom";
import Select from "react-select";

import { logoutUser } from "../../redux/actions";
import avatar from "./download.svg";

const customStyles = {
  control: (base) => ({
    ...base,
    minHeight: 30,
    fontSize: "14px",
    border: "0",
    borderRadius: "0",
    outline: "0",
    borderBottom: "1px solid rgb(44, 44, 44)",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: 6,
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: 4,
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "white",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0px 6px",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
};
const Navbar = (props) => {
  const [dropdownState, setDropdownState] = useState(false);
  const ref = useRef();
  const history = useHistory();
  const location = useLocation();

  const path = location.pathname.split("/")[2];

  setTimeout(() => {
    const list = document.querySelectorAll("#ul li");
    list.forEach((item) =>
      item.addEventListener("click", (e) => {
        list.forEach((li) => {
          li === item
            ? li.classList.add("bottom-border")
            : li.classList.remove("bottom-border");
        });
      })
    );
  }, 1200);

  // useEffect(() => {
  //   setTimeout(() => {
  //     const list = document.querySelectorAll("#ul li");
  //     if (path) {
  //       list.forEach((el, index) =>
  //         index <= 4 && el.children[0].innerHTML.trim().toLowerCase() === path
  //           ? el.classList.add("bottom-border")
  //           : el.classList.remove("bottom-border")
  //       );
  //     }

  //     location.pathname === "/" && list[0].classList.add("bottom-border");
  //   }, 1500);
  // }, [path, location]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    props.logoutUser(history);
    setDropdownState(false);
  };

  const handleDropdownChange = (item) => {
    history.push(`/field/${item.value.toLowerCase()}`);
  };
  const options = props.posts?.map((item) => {
    return {
      value: item.fieldName,
      label: item.fieldName,
    };
  });

  return (
    <React.Fragment>
      <div className="navbar-wrapper">
        <div className="nav-contents">
          <div className="brand-logo">
            <img
              src="https://www.pngitem.com/pimgs/m/19-196348_logo-logotipo-de-la-plantilla-grey-free-logo.png"
              alt="brand logo"
            />
          </div>
          <div className="nav-details">
            <div className="nav-profile">
              <img
                onClick={() => setDropdownState(!dropdownState)}
                src={props.isAuth ? props.userDetails.profileUrl : avatar}
                alt="profileimage"
              />
              <div
                className={
                  dropdownState ? "dropdown dropdown-active" : "dropdown"
                }>
                {props.isAuth && (
                  <Link
                    to={`/user/profile/${props.userDetails?.userId}?path=posts`}>
                    <span onClick={() => setDropdownState(false)}>Profile</span>
                  </Link>
                )}
                {props.isAuth ? (
                  <span onClick={handleLogout}>Logout</span>
                ) : (
                  <Link to="/user/login">
                    <span onClick={() => setDropdownState(false)}>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="list-nav">
        <ul id="ul" ref={ref}>
          <li>
            <Link to="/">Popular</Link>
          </li>
          <li>
            <Link to="/field/sports">Sports</Link>
          </li>
          <li>
            <Link to="/field/engineering">Engineering</Link>
          </li>
          <li>
            <Link to="/field/design">Design</Link>
          </li>
          {props.isAuth && (
            <li>
              <Link to="/create/post">Create</Link>
            </li>
          )}
          <li>
            <Select
              placeholder="Search"
              options={options}
              search
              styles={customStyles}
              className="select-dropdown"
              onChange={handleDropdownChange}
              maxMenuHeight={200}
            />
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};
const mapStateToProps = (state) => {
  return {
    isAuth: state.Auth.Auth,
    userDetails: state.Auth.userData,
    posts: state.posts,
  };
};

export default connect(mapStateToProps, { logoutUser })(Navbar);
