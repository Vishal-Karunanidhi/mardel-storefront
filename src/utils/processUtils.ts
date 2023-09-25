const v8 = require('v8');

const getProcessProps = () => ({
  uptime: getUptimeInfo(),
  platform: process.platform,
  storefrontSystem: process.arch,
  isAnyCaptureException: process.hasUncaughtExceptionCaptureCallback(),

  memoryUsage: getMemoryUseInfo(),
  v8HeapStats: getV8HeapInfo(),
  cpu: getCputimeInfo(),
  release: process.release
});

const getMemoryUseInfo = () => {
  const memoryInfo = {};
  for (const [key, value] of Object.entries(process?.memoryUsage())) {
    memoryInfo[key] = `${convMemoryInMb(value)} MB`;
  }
  return memoryInfo;
};

const getV8HeapInfo = () => {
  const memoryInfo = {};
  for (const [key, value] of Object.entries(v8?.getHeapStatistics())) {
    memoryInfo[key] = `${convMemoryInMb(value)} MB`;
  }
  return memoryInfo;
};

const getUptimeInfo = () => {
  return `${convToRoundHrs(process?.uptime())} Hrs`;
};

const getCputimeInfo = () => {
  const { user, system } = process?.cpuUsage() ?? {};
  return {
    user: `${convToRoundHrs(user)} Hrs`,
    system: `${convToRoundHrs(system)} Hrs`
  };
};

const roundOff = (input, digits = 2) => input?.toFixed(digits);
const convToRoundHrs = (input) => roundOff(input / (60 * 60));
const convMemoryInMb = (input, digits = 2) => roundOff(input / 1000000);

export { getProcessProps };
