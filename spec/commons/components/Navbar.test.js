import React from 'react'
import {shallow} from 'enzyme'
import Navbar from '../../../src/app/commons/components/Navbar.jsx'

function setup() {
    const enzymeWrapper = shallow(<Navbar />);

    return {
        enzymeWrapper
    }
}


describe('components', () => {
    describe('Navbar', () => {
        it('should self-render', () => {
            const {enzymeWrapper} = setup();
            expect(enzymeWrapper.find('.navbar').hasClass('navbar')).toBe(true);
        });
    })
});
