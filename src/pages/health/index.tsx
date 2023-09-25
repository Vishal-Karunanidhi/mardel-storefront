import { GetServerSideProps } from 'next/types';
import { getProcessProps } from '@Utils/processUtils';

/*Inline Stylings have been used to support the api/health-check endpoint*/
const styles = {
  parentTable: {
    background: 'white',
    border: '1px solid #ededed',
    margin: '20px auto',
    overflow: 'hidden',
    padding: 0,
    width: 'auto'
  },
  firstTr: {
    backgroundColor: 'rgb(204, 236, 249)'
  },
  thTd: {
    border: 0,
    borderBottom: '1px solid #ededed',
    padding: 12
  }
};

export default function HealthCheck({ processProps }: any) {
  const { uptime, storefrontSystem, platform, isAnyCaptureException } = processProps;
  const { cpu, memoryUsage, v8HeapStats } = processProps;

  const singleSetData = { uptime, storefrontSystem, platform, isAnyCaptureException };

  const batchOne = {
    cpu,
    memoryUsage
  };
  const batchTwo = {
    v8HeapStats
  };

  const getSingleSetData = (input, compToPush) => {
    Object.keys(input)?.forEach((key) => {
      compToPush.push(
        <tr>
          <td style={{ textTransform: 'capitalize', ...styles.thTd }}>
            {key?.replaceAll('_', ' ')}
          </td>
          <td style={styles.thTd}>{input[key]}</td>
        </tr>
      );
    });
    return compToPush;
  };

  const getMultiObjStats = (batchInfo) => {
    let comp = [];
    Object.keys(batchInfo)?.map((e) => {
      comp.push(
        <tr>
          <td style={styles.thTd}>
            <b>{e?.toUpperCase()}</b>
          </td>
          <td style={styles.thTd}></td>
        </tr>
      );
      getSingleSetData(batchInfo[e], comp);
    });
    return <>{comp}</>;
  };

  const Header = (
    <tr style={styles.firstTr}>
      <th style={styles.thTd}>Parameter</th>
      <th style={styles.thTd}>Value (MB / Hrs)</th>
    </tr>
  );

  return (
    <>
      <h1 style={{ display: 'flex', justifyContent: 'space-around' }}>
        <strong>Storefront Service is up and running</strong>
      </h1>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <table style={{ borderCollapse: 'collapse', ...styles.parentTable }}>
          {Header}
          {getSingleSetData(singleSetData, [])}
          {getMultiObjStats(batchOne)}
        </table>

        <table style={{ borderCollapse: 'collapse', ...styles.parentTable }}>
          {Header}
          {getMultiObjStats(batchTwo)}
        </table>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const processProps = getProcessProps();
  return {
    props: { processProps }
  };
};
