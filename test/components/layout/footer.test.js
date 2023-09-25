import '@testing-library/jest-dom';
import Footer from '@Components/layout/footer';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Footer Config', () => {
  it('renders a layout with header with footer', () => {
    render(<Footer />);
    expect(screen.getByText('Terms of use')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });
});
