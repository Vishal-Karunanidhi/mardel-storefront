import '@testing-library/jest-dom';
import Layout from '@Components/layout';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Layout', () => {
  it('renders a layout with header with footer', () => {
    render(
      <Layout>
        <div>Sample Code base</div>
      </Layout>
    );
    expect(screen.getByText('HL Base Code')).toBeInTheDocument();
    expect(screen.getByText('Sample Code base')).toBeInTheDocument();
    expect(screen.getByText('Terms of use')).toBeInTheDocument();
  });
});
