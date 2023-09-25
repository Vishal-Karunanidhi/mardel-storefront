import { renderToString } from 'react-dom/server';
import { getProcessProps } from '@Utils/processUtils';
import HealthCheck from '@Pages/health';

export default function handler(req, res) {
  const processProps = getProcessProps();
  const html = renderToString(<HealthCheck processProps={processProps} />);
  res.send(html);
  // res
  //   .status(200)
  //   .json({ status: 'Storefront Service is up and running', processProps: getProcessProps() });
}
