import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [sendMsgBlock, setSendMsgBlock] = useState([]); // set messages array
  const [sendMessage, setSendMessage] = useState(""); // real time input message
  const [newSendMessage, setNewSendMessage] = useState(""); // new message after submit button clicked
  const [newReplyMessage, setNewReplyMessage] = useState(""); // server generating text
  const [fetchError, setFetchError] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const inputRef = useRef(); // input field directly access
  const link = {
    oldLink: "http://localhost:8000/api",
    newLink: "chat-with-gemini-server-production.up.railway.app/api"
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(newSendMessage != "") {
          const response = await axios.post(link.newLink, {
            message: newSendMessage,
          });
          setNewReplyMessage(response.data.reply);
        } else {
          return;
        }
      } catch(err) {
        setFetchError(err);
      } finally {
        setIsBtnDisabled(false);
        setLoading(false);
      }
    }
    fetchData();
  }, [newSendMessage]);

  function handleSubmit(e) {
    e.preventDefault();
    setSendMsgBlock(pre => [...pre, {
      input: newSendMessage, // previous message store
      output: newReplyMessage, // previous reply message store
    }]);
    setNewSendMessage("");
    setNewSendMessage(sendMessage);
    setIsBtnDisabled(true);
    setLoading(true);
    setNewReplyMessage("");
    inputRef.current.value = "";
  }

  function handleChange(e) {
    setSendMessage(e.target.value);
  }

  return (
    <div className="container">
      <h1>Chat with Gemini AI</h1>
      <div className="display-area">
        {sendMsgBlock.length > 0 ? ( // array through old messages
          sendMsgBlock.map(data => (
            (data.input != "" && data.output != "") &&
            (<>
              <p className="user">{data.input}</p>
              <p className="machine">{data.output}</p>
            </>)
          ))
        ) : ""}
        {newSendMessage? <p className="user">{newSendMessage}</p> : ""}
        {newReplyMessage? <p className="machine">{newReplyMessage}</p> : (loading? <p><i className="fa-solid fa-spinner" style={{color: "#FFD43B", fontSize: "1.125rem"}}></i></p> : "")}
      </div>
      <div className="msg-send">
        <form onSubmit={handleSubmit}>
          {/* <input type="text" name="msg" id="msg" onChange={handleChange} placeholder="Enter a message" /> */}
          <textarea name="msg" id="msg" onChange={handleChange} placeholder="Enter a message ..." ref={inputRef} />
          <button type="submit" disabled={isBtnDisabled}><i className="fa-solid fa-paper-plane"></i></button>
        </form>
      </div>
      <h6>&copy; {new Date().getFullYear()} ROOM8 Productions</h6>
    </div>
  );
}

export default App;