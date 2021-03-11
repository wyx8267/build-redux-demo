import React from 'react';
import ReactDOM from 'react-dom';
import './style.css'

/**
 * 3 - createStore
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

store.dispatch({type: CREATE_NOTE})

const renderApp = () => {
  ReactDOM.render(
    <pre>{JSON.stringify(store.getState(), null, 2)}</pre>,
    document.getElementById('root')
  )
}

renderApp()