import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders the header', () => {
    render(<App />);
    const headerElement = screen.getByRole('heading', { name: /welcome to textcrafter/i });
    expect(headerElement).toBeInTheDocument();
  });

  test('renders the button', () => {
    render(<App />);
    const buttonElement = screen.getByRole('button', { name: /submit/i });
    expect(buttonElement).toBeInTheDocument();
  });
});
