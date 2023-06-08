import React, { useState } from "react";
import classNames from "classnames";
import moment from "moment";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { useAuthState } from "../../context/auth";
// import { gql, useMutation } from "@apollo/client";

// const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']

// const REACT_TO_MESSAGE = gql`
//   mutation reactToMessage($uuid: String!, $content: String!) {
//     reactToMessage(uuid: $uuid, content: $content) {
//       uuid
//     }
//   }
// `;

export default function Message({ message }) {
  console.log(message);
  const { user } = useAuthState();
  // console.log("userauthmessgae::::", user);
  // console.log("message::::", message);
  // const sortingMessage = message;
  // console.log("sortingMessage::::", sortingMessage);

  const sent = message.from === user.userName;
  const received = !sent;
  // debugger;
  // console.log("sent::::", sent);
  // console.log(sortingMessage, "sortingMessage");
  return (
    <>
      <div
        className={classNames("d-flex my-3", {
          "ml-auto": sent,
          "mr-auto": received,
        })}
      >
        <div className="d-flex ">
          <div
            className={classNames("py-2 px-3 rounded-pill position-relative", {
              "bg-primary": sent,
              "bg-secondary": received,
            })}
          >
            <p
              className={classNames({
                "text-white": sent,
              })}
              key={message.uuid}
            >
              {console.log("final message:::", message.content)}
              {message.content}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
