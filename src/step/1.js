// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './style.css'

const initialState = {
  nextNodeId: 1,
  notes: {}
}

window.state = initialState;

const onAddNote = () => {
  const id = window.state.nextNodeId;
  window.state.notes[id] = {
    id,
    content: ''
  }
  window.state.nextNodeId++;
  renderApp()
}

const NoteApp = ({ notes }) => (
  <div>
    <ul className="note-list">
      {Object.keys(notes).map(id => (
        <li className="note-list-item" key={id}>{id}</li>
      ))}
      <button className="editor-button" onClick={onAddNote}>New Note</button>
    </ul>
  </div>
)

const renderApp = () => {
  ReactDOM.render(
    <NoteApp notes={window.state.notes} />,
    document.getElementById('root')
  )
}

renderApp()