import React from 'react';
import {Card, CardHeader, List, ListItem, TextField, FlatButton} from 'material-ui';
import Delete from 'material-ui/svg-icons/action/delete';
import {addNoteAction, removeNoteAction, editNoteAction, listNotes} from './NotesActions.jsx';

export default class Notes extends React.Component {
    componentWillMount() {
        let store = this.context.store;
        let user = store.getState().UserReducer.data.user.login;
        store.dispatch(listNotes(user))
    }

    componentDidMount() {
        let store = this.context.store;
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        let store = this.context.store;
        let state = store.getState();
        let user = state.UserReducer.data.user.login;
        const handleUpdateInput = (ev, text) => this.userInput = text;
        const addNoteHandler = () => store.dispatch(addNoteAction(this.userInput, user.toLowerCase()));
        const removeNoteHandler = (note) => store.dispatch(removeNoteAction(note, user.toLowerCase()));
        const editNoteHandler = (note, text) => store.dispatch(editNoteAction(note, text, user));

        return <div className='col s12 m12 l4'>
            <NotesTemplate
                notes={state.NotesReducer.notes}
                addNoteHandler={addNoteHandler}
                removeNoteHandler={removeNoteHandler}
                handleUpdateInput={handleUpdateInput}
                editNoteHandler={editNoteHandler}
            />
        </div>
    }
}

Notes.contextTypes = {
    store: React.PropTypes.object
};

const NotesTemplate = ({notes, addNoteHandler, handleUpdateInput, removeNoteHandler, editNoteHandler}) => (
    <Card>
        <CardHeader title='Notes'
                    subtitle='Click on item to edit'
        />
        <List>
            {notes.map((note) => {
                return <ListItem
                    key={notes.indexOf(note)}
                    rightIconButton={<RemoveButton removeNoteHandler={removeNoteHandler} note={note}/>}
                    secondaryText={note.text}
                    primaryTogglesNestedList={true}
                    secondaryTextLines={2}
                    nestedItems={[
                        <div style={{marginLeft: '30px'}}
                             value={2}
                             children={<EditForm editNoteHandler={editNoteHandler} note={note}/>}
                        />,
                    ]}
                />
            })}
        </List>
        <div className='center-align'>
            <NotesForm addNoteHandler={addNoteHandler} handleUpdateInput={handleUpdateInput}/>
        </div>
    </Card>
);

const NotesForm = ({handleUpdateInput, addNoteHandler}) => (
    <div>
        <TextField id='user-input' onChange={handleUpdateInput}/>
        <FlatButton label='Add' onClick={addNoteHandler}/>
    </div>
);

const EditForm = ({editNoteHandler, note}) => (
    <TextField id='user-input' onChange={(ev, text) => editNoteHandler(note, text)}/>
);

const RemoveButton = ({removeNoteHandler, note}) => (
    <Delete onClick={() => removeNoteHandler(note)} style={{float: 'right'}}/>
);