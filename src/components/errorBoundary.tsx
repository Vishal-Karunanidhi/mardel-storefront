import { Component } from 'react';
import ErrorPage from '@Pages/500';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary Triggered================', error, errorInfo);
  }
  render() {
    if (this.state?.['hasError']) {
      return <ErrorPage />;
    }
    return this.props?.['children'];
  }
}

export default ErrorBoundary;
