import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import ErrorMessageAlert from "../components/alert";

import { useAuthDispatch } from "../context/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import jwtDecode from "jwt-decode";

// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

const LOGIN_USER = gql`
  mutation login($identifier: String!, $password: String!) {
    login(identifier: $identifier, password: $password) {
      name
      email
      token
    }
  }
`;

const schema = Yup.object().shape({
  identifier: Yup.string().required("Email/Phone is required"),
  password: Yup.string().required("Password is required"),
});

export default function Register(props) {
  const history = useHistory();

  const [variables, setVariables] = useState({
    name: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const [variablesError, setVariablesError] = useState({
    name: "",
    password: "",
    isWarningName: false,
    isWarningPassword: false,
  });

  const [validatedObject, setValidatedObject] = useState({
    isWarning: false,
    message: "",
  });

  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      console.log("data:::", data);
      dispatch({ type: "LOGIN", payload: data.login });
      localStorage.setItem("token", data.login.token);
      const decodedUser = jwtDecode(data.login.token);
      localStorage.setItem("currentUser", JSON.stringify(decodedUser));
      history.push("/");
    },
    onError: (err) => {
      setErrors(err.graphQLErrors[0].message);
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Email / Phone Or Password Is Wrong.",
      });
    },
    // onQueryUpdated(data) {
    //   // console.log("data:::", data);
    //   dispatch({ type: "LOGIN", payload: data.login });

    //   history.push("/");
    // },
  });

  const handleFormChange = (e) => {
    e.preventDefault();

    let { name, value } = e.target;

    setVariables({ [name]: value });
  };

  // let validateRequest = () => {
  //   const { username, password } = variables;

  //   if (username === "" || username === null || username === undefined) {
  //     // return setValidatedObject({
  //     //   ...validatedObject,
  //     //   isWarning: true,
  //     //   message: "Username is required",
  //     // });
  //     return setVariablesError({
  //       ...variablesError,
  //       username: "Username is required",
  //       password: "",
  //       isWarningPassword: false,
  //       isWarningUsername: true,
  //     });
  //   }

  //   if (password === "" || username === null || username === undefined) {
  //     // return setValidatedObject({
  //     //   ...validatedObject,
  //     //   isWarning: true,
  //     //   message: "Password is required",
  //     // });
  //     return setVariablesError({
  //       ...variablesError,
  //       password: "Password is required",
  //       isWarningPassword: true,
  //       username: "",
  //       isWarningUsername: false,
  //     });
  //   }
  //   return true;
  // };

  const submitLoginForm = (values) => {
    // e.preventDefault();
    // console.log("values submit:::", values);
    // let validate = validateRequest();
    let { identifier, password } = values;
    // if (validate) {
    // setVariablesError({
    //   ...variablesError,
    //   password: "",
    //   isWarningPassword: "false",
    //   username: "",
    //   isWarningUsername: false,
    // });
    // setValidatedObject({
    //   ...validatedObject,
    //   isWarning: false,
    //   message: "",
    // });

    try {
      loginUser({
        variables: {
          identifier: identifier,
          password: password,
        },
      });
    } catch (error) {
      console.log("error in login::", error.message);
    }
    // }
  };

  return (
    // <Row className="bg-white py-5 justify-content-center">
    //   <Col sm={8} md={6} lg={4}>
    //     <h1 className="text-center">Login</h1>
    //     <Form onSubmit={submitLoginForm}>
    //       {validatedObject.isWarning && (
    //         <ErrorMessageAlert
    //           message={validatedObject.message}
    //         ></ErrorMessageAlert>
    //       )}
    //       <Form.Group>
    //         <Form.Label className={errors.username && "text-danger"}>
    //           {/* {errors.username ?? "Username"} */}
    //           Username
    //         </Form.Label>
    //         <Form.Control
    //           type="text"
    //           value={variables.username}
    //           // className={errors.username && "is-invalid"}
    //           onChange={(e) =>
    //             setVariables({ ...variables, username: e.target.value })
    //           }
    //         />
    //       </Form.Group>
    //       <Form.Group>
    //         <Form.Label className={errors.password && "text-danger"}>
    //           {/* {errors.password ?? "Password"} */}
    //           Password
    //         </Form.Label>
    //         <Form.Control
    //           type="password"
    //           value={variables.password}
    //           // className={errors.password && "is-invalid"}
    //           onChange={(e) =>
    //             setVariables({ ...variables, password: e.target.value })
    //           }
    //         />
    //       </Form.Group>
    //       <div className="text-center">
    //         <Button variant="success" type="submit" disabled={loading}>
    //           {loading ? "loading.." : "Login"}
    //         </Button>
    //         <br />
    //         <small>
    //           Don't have an account? <Link to="/register">Register</Link>
    //         </small>
    //       </div>
    //     </Form>
    //   </Col>
    // </Row>
    <>
      <Formik
        validationSchema={schema}
        initialValues={{ identifier: "", password: "" }}
        onSubmit={(values) => {
          submitLoginForm(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className="login">
            <Row>
              <Col sm={8} md={6} lg={10} className="m-auto">
                <h1 className="text-center mt-2">Login</h1>

                <Form onSubmit={handleSubmit}>
                  {validatedObject.isWarning && (
                    <ErrorMessageAlert
                      message={validatedObject.message}
                    ></ErrorMessageAlert>
                  )}
                  <Form.Group>
                    <Form.Label className="d-flex">
                      {/* {errors.username ?? "Username"} */}
                      Email/Phone
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="identifier"
                      value={values.identifier}
                      // className={errors.username && "is-invalid"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id="identifier"
                      // placeholder="Please enter your email or mobile number"
                      className="placeholder-color"
                    />
                    {/* {variablesError.isWarningUsername && (
                      <p className="mt-2 mb-2" style={{ color: "red" }}>
                        {variablesError.username}
                      </p>
                    )} */}
                    <p className="error">
                      {errors.identifier &&
                        touched.identifier &&
                        errors.identifier}
                    </p>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="d-flex mt-2">
                      {/* {errors.password ?? "Password"} */}
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={values.password}
                      // className={errors.password && "is-invalid"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      // placeholder="Please enter your password"
                    />
                    {/* {variablesError.isWarningPassword && (
                      <p className="mt-2 mb-2" style={{ color: "red" }}>
                        {variablesError.password}
                      </p>
                    )} */}
                    <p className="error">
                      {errors.password && touched.password && errors.password}
                    </p>
                  </Form.Group>
                  <div className="text-center mt-3 mb-3">
                    <Button variant="success" type="submit" disabled={loading}>
                      {loading ? "loading.." : "Login"}
                    </Button>
                    <br />
                    <small>
                      Don't have an account?{" "}
                      <Link to="/register">Register</Link>
                    </small>
                  </div>
                </Form>
              </Col>
            </Row>
          </div>
        )}
      </Formik>
    </>
  );
}
