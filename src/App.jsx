import React from 'react'

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
  
}

export default function App () {
  return (
    <div>MH</div>
  )
}