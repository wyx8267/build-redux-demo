import React from 'react';
import ReactDOM from 'react-dom';
import './style.css'

/**
 * 2-2 - Array.reduce()
 */

const initialState = {
  nextNodeId: 1,
  notes: {}
}

const CREATE_NOTE = 'CREATE_NOTE'
const UPDATE_NOTE = 'UPDATE_NOTE'

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_NOTE:
      const id = state.nextNodeId;
      const newNote = {
        id,
        content: ''
      };
      return {
        ...state,
        nextNodeId: id + 1,
        notes: {
          ...state.notes,
          [id]: newNote
        }
      }
    case UPDATE_NOTE:
      const { editId, content } = action;
      const editedNote = {
        ...state.notes[editId],
        content
      }
      return {
        ...state,
        notes: {
          ...state.notes,
          [editId]: editedNote
        }
      }
    default:
      return state
  }
}

const actions = [
  {
    type: CREATE_NOTE
  }, {
    type: UPDATE_NOTE,
    editId: 1,
    content: 'HELLO REDUX'
  }
]

const state = actions.reduce(reducer,undefined)

const renderApp = () => {
  ReactDOM.render(
    <pre>{JSON.stringify(state, null, 2)}</pre>,
    document.getElementById('root')
  )
}

renderApp()