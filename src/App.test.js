import { render, screen } from '@testing-library/react';
import App from './App';

test('renders color guessing instructions', () => {
  render(<App />);
  const instructions = screen.getByText(/select the correct color/i);
  expect(instructions).toBeInTheDocument();
});

