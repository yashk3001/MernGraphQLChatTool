import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Col, Image } from "react-bootstrap";
import classNames from "classnames";

import { useMessageDispatch, useMessageState } from "../../context/message";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      name
      createdAt
      profilePicUrl
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`;

export default function Users() {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true)?.name;

  // console.log("selectedUser:::", selectedUser);

  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) =>
      dispatch({ type: "SET_USERS", payload: data.getUsers }),
    onError: (err) => console.log(err),
  });

  let usersMarkup;
  if (!users || loading) {
    usersMarkup = <p>Loading..</p>;
  } else if (users.length === 0) {
    usersMarkup = <p>No users have joined yet</p>;
  } else if (users.length > 0) {
    usersMarkup = users.map((user) => {
      console.log("user:::::", user);
      const selected = selectedUser === user.name;
      return (
        <div
          role="button"
          className={classNames(
            "user-div d-flex justify-content-center justify-content-md-start p-3",
            {
              "bg-white": selected,
            }
          )}
          key={user.name}
          onClick={() => {
            console.log("presss");
            dispatch({ type: "SET_SELECTED_USER", payload: user.name });
          }}
        >
          <Image
            src={
              user.profilePicUrl ||
              "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=826&t=st=1685533082~exp=1685533682~hmac=db9074a80a12b1a28a276e3902ad2db0c17c82fd27fe5a640d6538318c3e436c"
            }
            className="user-image"
          />
          <div className="d-none d-md-block ml-3 gap-2">
            <p className="text-success">{user.name}</p>
            <p className="font-weight-light">
              {user.latestMessage
                ? user?.latestMessage?.content
                : "You are now connected!"}
            </p>
          </div>
        </div>
      );
    });
  }
  return (
    <Col xs={2} md={4} className="p-0 bg-secondary">
      {usersMarkup}
    </Col>
  );
}
