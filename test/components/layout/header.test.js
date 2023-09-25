import '@testing-library/jest-dom';
import Header from '@Components/layout/header';
import { fireEvent, render, screen } from '@testing-library/react';

const menuItems = [
  {
    name: 'Categories',
    path: '',
  },
  {
    name: 'Products',
    path: 'products',
  },
];

describe('Header Config', () => {
  it('renders a layout with header with footer', () => {
    render(<Header menuItems={menuItems} />);
    expect(screen.getByText('HL Base Code')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });
});
