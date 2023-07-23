import { render, screen } from '@testing-library/react';
import App from './App/index';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Forgot password?/i);
  expect(linkElement).toBeInTheDocument();
});
