import React from 'react'
import {mount} from 'enzyme'
import Notes from '../../../../src/app/home/components/Notes/Notes.jsx'
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reducers from '../../../../src/app/reducers.jsx';
import thunk from 'redux-thunk';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


function setup() {
    const store = createStore(reducers, applyMiddleware(thunk));
    const enzymeWrapper = mount(
        <Provider store={store}>
            <MuiThemeProvider>
                <Notes />
            </MuiThemeProvider>
        </Provider>
    );

    return {
        enzymeWrapper
    }
}

describe('components', () => {
    describe('Notes', () => {
        it('should self-render', () => {
            const {enzymeWrapper} = setup();
            expect(enzymeWrapper.find(Notes)).toBeTruthy();
        });
    })
});
