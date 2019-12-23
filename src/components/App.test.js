import React from 'react';
import {render, fireEvent, screen, waitForElement} from '@testing-library/react';
import App from './App';

/**
 * react-testing-library is not able to connect to IndexedDB, so we can't create a database related unit test
 */

test('renders submit button', () => {
    const {getByText} = render(<App/>);
    const linkElement = getByText(/Submit/i);
    expect(linkElement).toBeInTheDocument();
});

test('quantity should be positive or negative but not zero', async () => {
    const {container} = render(<App/>);

    fireEvent.change(screen.getByLabelText(/Quantity/i), {
        target: {value: '0'},
    });
    fireEvent.click(screen.getByText(/Submit/i));
    await waitForElement(() => container.querySelector(".Mui-error"));
    expect(screen.getByText('Please input a valid quantity')).toBeInTheDocument();
});

test('quantity should be numeric', async () => {
    const {container} = render(<App/>);

    fireEvent.change(screen.getByLabelText(/Quantity/i), {
        target: {value: 'chuck'},
    });
    fireEvent.click(screen.getByText(/Submit/i));
    await waitForElement(() => container.querySelector(".Mui-error"));
    expect(screen.getByText('Please input a valid quantity')).toBeInTheDocument();
});
