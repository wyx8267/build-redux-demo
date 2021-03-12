import React from 'react'
import ReactDOM from 'react-dom';
import './style.css'
import NoteAppContainer from './App.jsx'

const initialState = {
  nextNodeId: 1,
  notes: {},
  openNoteId: null
}

const CREATE_NOTE = 'CREATE_NOTE'
const UPDATE_NOTE = 'UPDATE_NOTE'
const OPEN_NOTE = 'OPEN_NOTE'
const CLOSE_NOTE = 'CLOSE_NOTE'

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
        openNoteId: id,
        notes: {
          ...state.notes,
          [id]: newNote
        }
      }
    case UPDATE_NOTE:
      const editedNote = {
        ...state.notes[action.id],
        content: action.content
      }
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: editedNote
        }
      }
      case OPEN_NOTE: {
        return {
          ...state,
          openNoteId: action.id
        };
      }
      case CLOSE_NOTE: {
        return {
          ...state,
          openNoteId: null
        };
      }
    default:
      return state
  }
}

const validateAction = action => {
  if (!action || typeof action !== 'object' || Array.isArray(action)) {
    throw new Error('Action must be an object!')
  }
  if (typeof action === 'undefined') {
    throw new Error('Action must have a type!')
  }
}

const createStore = (reducer) => {
  let state = undefined;
  const subscribers = []
  const store = {
    dispatch: (action) => {
      validateAction(action)
      state = reducer(state, action)
      subscribers.forEach(handler => handler())
    },
    getState: () => state,
    subscribe: handler => {
      subscribers.push(handler)
      return () => {
        const index = subscribers.indexOf(handler);
        if (index > 0) {
          subscribers.splice(index, 1)
        }
      }
    }
  }
  store.dispatch({ type: '@@redux/INIT' })
  return store
}

const store = createStore(reducer)

store.dispatch({ type: CREATE_NOTE })

const renderApp = () => {
  ReactDOM.render(
    <NoteAppContainer store={store}/>,
    document.getElementById('root')
  )
}

renderApp()