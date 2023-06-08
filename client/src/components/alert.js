import React from "react";
const ErrorMessageAlert = (props) => {
  return (
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Warning!</strong> {props.message}
    </div>
  );
};

export default ErrorMessageAlert;
