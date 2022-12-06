const timeFormatter = (timestamp, useSeconds = true) => {
  if (isNaN(timestamp)) {
    return timestamp;
  }

  const date = new Date(timestamp);
  const hour = '0' + date.getHours();
  const min = '0' + date.getMinutes();
  const sec = '0' + date.getSeconds();

  return useSeconds
    ? hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2)
    : hour.substr(-2) + ':' + min.substr(-2);
};

export default timeFormatter;
