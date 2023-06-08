import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
// import DatePicker from "react-bootstrap-date-picker";
// import "react-bootstrap-date-picker/dist/react-bootstrap-date-picker.min.css";
// import {ToastContainer} from "react-toastify";
// import toast from "react-tostify";
import "react-toastify/dist/ReactToastify.css";
import ErrorMessageAlert from "../components/alert";

const REGISTER_USER = gql`
  mutation register(
    $email: String!
    $name: String
    $gender: String
    $mobileNumber: String
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      email: $email
      name: $name
      gender: $gender
      mobileNumber: $mobileNumber
      password: $password
      confirmPassword: $confirmPassword
    ) {
      name
      email
      createdAt
    }
  }
`;

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required "),
  email: Yup.string()
    .required("Email is a required ")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is a required ")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password & confirm Password not match")
    .required("Confirm password is required "),
  gender: Yup.string()
    .required("Gender is required")
    .oneOf(["male", "female", "other"], "Invalid Gender"),
  mobileNumber: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Invalid mobile number"),
});

export default function Register(props) {
  const history = useHistory();

  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const [validatedObject, setValidatedObject] = useState({
    isWarning: false,
    message: "",
  });
  const [variablesError, setVariablesError] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    emailValidation: "",
    passwordValidation: "",
    passnotmatch: "",
    isWarningEmail: false,
    isWarningUsername: false,
    isWarningPassword: false,
    isWarningConfirmPassword: false,
    isWarningEmailvalidation: false,
    isWarningPasswordValidation: false,
    isWarningPassNotMatch: false,
  });

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, __) => {
      // toast("Hello, World!", {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 2000,
      //   hideProgressBar: true,
      //   pauseOnHover: false,
      //   draggable: false,
      // });
      history.push("/login");
    },
    onError: (err) => {
      setErrors(err.graphQLErrors[0].message);
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Email / Mobile number Is Already Taken Try Different.",
      });
    },
  });

  let validateRequest = () => {
    const { email, confirmPassword, password, username } = variables;

    const re =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{9,}$/;

    const passwordValidation = re.test(String(password));

    const re_email =
      //eslint-disable-next-line
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailValidation = re_email.test(String(email));

    if (email === "" || email === null || email === undefined) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Email is required",
      });
      // setVariablesError({
      //   ...variablesError,
      //   email: "Email is required",
      //   username: "",
      //   password: "",
      //   confirmPassword: "",
      //   emailValidation: "",
      //   passwordValidation: "",
      //   passnotmatch: "",
      //   isWarningEmail: true,
      //   isWarningUsername: false,
      //   isWarningPassword: false,
      //   isWarningConfirmPassword: false,
      //   isWarningEmailvalidation: false,
      //   isWarningPasswordValidation: false,
      //   isWarningPassNotMatch: false,
      // });
    } else if (!emailValidation) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Please provide valid email",
      });
      // setVariablesError({
      //   ...variablesError,
      //   email: "",
      //   username: "",
      //   password: "",
      //   confirmPassword: "",
      //   emailValidation: "Please provide valid email",
      //   passwordValidation: "",
      //   passnotmatch: "",
      //   isWarningEmail: false,
      //   isWarningUsername: false,
      //   isWarningPassword: false,
      //   isWarningConfirmPassword: false,
      //   isWarningEmailvalidation: true,
      //   isWarningPasswordValidation: false,
      //   isWarningPassNotMatch: false,
      // });
    } else if (username === "" || username === null || username === undefined) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Username is required",
      });
      // setVariablesError({
      //   ...variablesError,
      //   email: "",
      //   username: "Username is required",
      //   password: "",
      //   confirmPassword: "",
      //   emailValidation: "",
      //   passwordValidation: "",
      //   passnotmatch: "",
      //   isWarningEmail: false,
      //   isWarningUsername: true,
      //   isWarningPassword: false,
      //   isWarningConfirmPassword: false,
      //   isWarningEmailvalidation: false,
      //   isWarningPasswordValidation: false,
      //   isWarningPassNotMatch: false,
      // });
    } else if (password === "" || password === null || password === undefined) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Password is required",
      });
      // setVariablesError({
      //   ...variablesError,
      //   password: "Password is required",
      //   isWarningPassword: true,
      // });
    } else if (!passwordValidation) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message:
          "Please choose a more secure password. password must be greater than 8 characters long and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
      });
      // setVariablesError({
      //   ...variablesError,
      //   passwordValidation:
      //     "Please choose a more secure password. password must be greater than 8 characters long and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
      //   isWarningPasswordValidation: true,
      // });
    } else if (
      confirmPassword === "" ||
      confirmPassword === null ||
      confirmPassword === undefined
    ) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Confirm-Password is required!",
      });
      // setVariablesError({
      //   ...variablesError,
      //   confirmPassword: "Confirm Password is required",
      //   isWarningConfirmPassword: true,
      // });
    } else if (password !== confirmPassword) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Password and confirm password not matched!",
      });
      // setVariablesError({
      //   ...variablesError,
      //   passnotmatch: "Password is required",
      //   isWarningPassNotMatch: true,
      // });
    }
    return true;
  };

  const submitRegisterForm = (values) => {
    // e.preventDefault();

    // let { email, name, password, confirmPassword } = values;
    console.log("values reg:::", values);

    let { email, name, gender, password, confirmPassword, mobileNumber } =
      values;

    // let validate = validateRequest();

    // if (validate) {
    // setVariablesError({
    //   ...variablesError,
    //   email: "",
    //   username: "",
    //   password: "",
    //   confirmPassword: "",
    //   emailValidation: "",
    //   passwordValidation: "",
    //   passnotmatch: "",
    //   isWarningEmail: false,
    //   isWarningUsername: false,
    //   isWarningPassword: false,
    //   isWarningConfirmPassword: false,
    //   isWarningEmailvalidation: false,
    //   isWarningPasswordValidation: false,
    //   isWarningPassNotMatch: false,
    // });
    // setValidatedObject({
    //   ...validatedObject,
    //   isWarning: false,
    //   message: "",
    // });

    // let data = {
    //   email: variables.email,
    //   username: variables.username,
    //   password: variables.password,
    // };

    // console.log("dataaaaa:::", data);

    try {
      registerUser({
        variables: {
          email: email,
          name: name,
          gender: gender,
          mobileNumber: mobileNumber,
          password: password,
          confirmPassword: confirmPassword,
        },
      });
    } catch (error) {
      console.log("error in reg:::", error.message);
    }
    // }
  };

  return (
    // <Row className="bg-white py-5 justify-content-center">
    //   <Col sm={8} md={6} lg={4}>
    //     <h1 className="text-center">Register</h1>
    //     <Form onSubmit={submitRegisterForm}>
    //       {validatedObject.isWarning && (
    //         <ErrorMessageAlert
    //           message={validatedObject.message}
    //           setValidatedObject={setValidatedObject}
    //         ></ErrorMessageAlert>
    //       )}
    //       <Form.Group>
    //         <Form.Label className={errors.email && "text-danger"}>
    //           {/* {errors.email ?? "Email address"}
    //            */}
    //           Email Address
    //         </Form.Label>
    //         <Form.Control
    //           type="email"
    //           value={variables.email}
    //           // className={errors.email && "is-invalid"}
    //           onChange={(e) =>
    //             setVariables({ ...variables, email: e.target.value })
    //           }
    //         />
    //       </Form.Group>
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
    //       <Form.Group>
    //         <Form.Label className={errors.confirmPassword && "text-danger"}>
    //           {/* {errors.confirmPassword ?? "Confirm password"} */}
    //           Confirm Password
    //         </Form.Label>
    //         <Form.Control
    //           type="password"
    //           value={variables.confirmPassword}
    //           // className={errors.confirmPassword && "is-invalid"}
    //           onChange={(e) =>
    //             setVariables({
    //               ...variables,
    //               confirmPassword: e.target.value,
    //             })
    //           }
    //         />
    //       </Form.Group>
    //       <div className="text-center">
    //         <Button variant="success" type="submit" disabled={loading}>
    //           {loading ? "loading.." : "Register"}
    //         </Button>
    //         <br />
    //         <small>
    //           Already have an account? <Link to="/login">Login</Link>
    //         </small>
    //       </div>
    //     </Form>
    //   </Col>
    // </Row>
    <>
      <Formik
        validationSchema={schema}
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
          mobileNumber: "",
          gender: "",
        }}
        onSubmit={(values) => {
          submitRegisterForm(values);
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
          <div className="login register">
            <Row className="bg-white py-5 justify-content-center">
              <Col sm={8} md={6} lg={10} className="m-auto">
                <h1 className="text-center">Register</h1>
                <Form onSubmit={handleSubmit}>
                  {validatedObject.isWarning && (
                    <ErrorMessageAlert
                      message={validatedObject.message}
                      setValidatedObject={setValidatedObject}
                    ></ErrorMessageAlert>
                  )}
                  <Form.Group>
                    <Form.Label className="d-flex mt-2 w-100">
                      {/* {errors.username ?? "Username"} */}
                      Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={values.name}
                      // className={errors.username && "is-invalid"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {/* {variablesError.isWarningUsername && (
                    <p className="mb-1" style={{ color: "red" }}>
                      {variablesError.username}
                    </p>
                  )} */}
                    <p className="error">
                      {errors.name && touched.name && errors.name}
                    </p>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="d-flex">
                      {/* {errors.email ?? "Email address"}
                       */}
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      // className={errors.email && "is-invalid"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {/* {variablesError.isWarningEmail && (
                    <p className="mt-2 mb-1" style={{ color: "red" }}>
                      {variablesError.email}
                    </p>
                  )}
                  {variablesError.isWarningEmailvalidation && (
                    <p className="mb-1" style={{ color: "red" }}>
                      {variablesError.emailValidation}
                    </p>
                  )} */}
                    <p className="error">
                      {errors.email && touched.email && errors.email}
                    </p>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="d-flex mt-2">
                      {/* {errors.username ?? "Username"} */}
                      Gender
                    </Form.Label>

                    <Form.Select
                      className="d-flex form-control"
                      name="gender"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                    {/* {variablesError.isWarningUsername && (
                    <p className="mb-1" style={{ color: "red" }}>
                      {variablesError.username}
                    </p>
                  )} */}
                    <p className="error mb-2">
                      {errors.gender && touched.gender && errors.gender}
                    </p>
                  </Form.Group>
                  {/* <Form.Group>
                  <Form.Label className="d-flex">Date Of Birth</Form.Label>
                  <DatePicker className="form-control" />
                </Form.Group> */}
                  <Form.Group>
                    <Form.Label className="d-flex">
                      {/* {errors.username ?? "Username"} */}
                      Mobile Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="mobileNumber"
                      value={values.mobileNumber}
                      // className={errors.username && "is-invalid"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {/* {variablesError.isWarningUsername && (
                    <p className="mb-1" style={{ color: "red" }}>
                      {variablesError.username}
                    </p>
                  )} */}
                    <p className="error">
                      {errors.mobileNumber &&
                        touched.mobileNumber &&
                        errors.mobileNumber}
                    </p>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="d-flex mt-2">
                      {/* {errors.password ?? "Password"} */}
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      value={values.password}
                      name="password"
                      // className={errors.password && "is-invalid"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {/* {variablesError.isWarningPassword && (
                    <p className="mb-1" style={{ color: "red" }}>
                      {variablesError.password}
                    </p>
                  )}
                  {variablesError.isWarningPasswordValidation && (
                    <p className="mb-1" style={{ color: "red" }}>
                      {variablesError.passwordValidation}
                    </p>
                  )} */}
                    <p className="error">
                      {errors.password && touched.password && errors.password}
                    </p>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="d-flex mt-2">
                      {/* {errors.confirmPassword ?? "Confirm password"} */}
                      Confirm Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      // className={errors.confirmPassword && "is-invalid"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {/* {variablesError.isWarningConfirmPassword && (
                    <p className="mb-1" style={{ color: "red" }}>
                      {variablesError.confirmPassword}
                    </p>
                  )}
                  {variablesError.isWarningPassNotMatch && (
                    <p className="mb-1" style={{ color: "red" }}>
                      {variablesError.passnotmatch}
                    </p>
                  )} */}
                    <p className="error">
                      {errors.confirmPassword &&
                        touched.confirmPassword &&
                        errors.confirmPassword}
                    </p>
                  </Form.Group>
                  <div className="text-center mt-3">
                    <Button variant="success" type="submit" disabled={loading}>
                      {loading ? "loading.." : "Register"}
                    </Button>
                    <br />
                    <small>
                      Already have an account? <Link to="/login">Login</Link>
                    </small>
                  </div>
                </Form>
              </Col>
            </Row>
          </div>
        )}
      </Formik>
      {/* <ToastContainer /> */}
    </>
  );
}
