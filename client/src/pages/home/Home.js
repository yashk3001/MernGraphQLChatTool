import React, { Fragment, useEffect, useState } from "react";
import { Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useSubscription, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useMessageDispatch } from "../../context/message";

import Users from "./Users";
import Messages from "./Messages";

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

const NEW_REACTION = gql`
  subscription newReaction {
    newReaction {
      uuid
      content
      message {
        uuid
        from
        to
      }
    }
  }
`;

export default function Home() {
  const history = useHistory();
  // const dispatch = useMessageDispatch()

  const authDispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();

  // const { loading } = useQuery(GET_USERS, {
  //   onCompleted: (data) =>
  //     dispatch({ type: "SET_USERS", payload: data.getUsers }),
  //   onError: (err) => console.log(err),
  // });
  // const [userId, setUserId] = useState("");

  const storedUser = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(storedUser);

  console.log("curUser::", currentUser);

  const { user } = useAuthState();

  console.log("userAuthHomr::::", user);

  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE);

  const { data: reactionData, error: reactionError } =
    useSubscription(NEW_REACTION);

  // const { loading } = useQuery(
  //   GET_USERS,
  //   {
  //     variables: {
  //       id: userId,
  //     },
  //   },
  //   {
  //     onCompleted: (data) =>
  //       dispatch({ type: "SET_USERS", payload: data.getUsers }),
  //     onError: (err) => console.log(err),
  //   }
  // );

  useEffect(() => {
    if (messageError) console.log(messageError);

    if (messageData) {
      const message = messageData.newMessage;
      const otherUser =
        user.userName === message.to ? message.from : message.to;

      messageDispatch({
        type: "ADD_MESSAGE",
        payload: {
          name: otherUser,
          message,
        },
      });
    }
  }, [messageError, messageData]);

  useEffect(() => {
    if (reactionError) console.log(reactionError);

    if (reactionData) {
      const reaction = reactionData.newReaction;
      const otherUser =
        user.name === reaction.message.to
          ? reaction.message.from
          : reaction.message.to;

      messageDispatch({
        type: "ADD_REACTION",
        payload: {
          name: otherUser,
          reaction,
        },
      });
    }
  }, [reactionError, reactionData]);

  // useEffect(() => {
  //   setUserId(currentUser.userId);
  // }, [currentUser]);

  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  // console.log(process.env.REACT_APP_URL, "hello");
  return (
    <Fragment>
      <div>
        <Row className="bg-white justify-content-around mb-1">
          <Link to="#">
            <Button variant="link">Chats</Button>
          </Link>
          <Link to="#">
            <Button variant="">Hello, {currentUser.userName}</Button>
          </Link>
          <Button variant="link" onClick={logout}>
            Logout
          </Button>
        </Row>
        <Row className="bg-white">
          <Users />
          <Messages />
        </Row>
      </div>
    </Fragment>
  );
}
