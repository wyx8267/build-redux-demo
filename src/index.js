import React from 'react'
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import './style.css'
import {NoteApp} from './App.jsx'

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
  store.dispatch({
    type: '@@redux/INIT'
  })
  return store
}

const store = createStore(reducer)

const mapStateToProps = state => ({
  notes: state.notes,
  openNoteId: state.openNoteId
});

const mapDispatchToProps = dispatch => ({
  onAddNote: () => dispatch({
    type: CREATE_NOTE
  }),
  onChangeNote: (id, content) => dispatch({
    type: UPDATE_NOTE,
    id,
    content
  }),
  onOpenNote: id => dispatch({
    type: OPEN_NOTE,
    id
  }),
  onCloseNote: () => dispatch({
    type: CLOSE_NOTE
  })
});

class Provider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store
    }
  }
  render() {
    return this.props.children
  }
}
Provider.childContextTypes = {
  store: PropTypes.object
};

const connect = (
  mapStateToProps = () => ({}),
  mapDispatchToProps = () => ({}),
) => Component => {
  class Connected extends React.Component {
    onStoreOrPropsChange(props) {
      const {
        store
      } = this.context
      const state = store.getState()
      const stateProps = mapStateToProps(state, props)
      const dispatchProps = mapDispatchToProps(store.dispatch, props)
      this.setState({
        ...stateProps,
        ...dispatchProps
      })
    }
    componentDidMount() {
      const {
        store
      } = this.context;
      this.onStoreOrPropsChange(this.props)
      this.unsubscribe = store.subscribe(() => this.onStoreOrPropsChange(this.props))
    }
    componentDidUpdate(nextProps) {
      this.onStoreOrPropsChange(nextProps)
    }
    componentWillUnmount() {
      this.unsubscribe()
    }
    render() {
      return <Component {
        ...this.props
      } {
        ...this.state
      }
      />
    }
  }
  Connected.contextTypes = {
    store: PropTypes.object
  };
  return Connected;
}

const NoteAppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteApp)

const renderApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <NoteAppContainer store={store} />
    </Provider>,
    document.getElementById('root')
  )
}

renderApp()