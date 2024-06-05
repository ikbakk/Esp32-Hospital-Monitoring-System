const dateFormatter = (timestamp: number, withDaysName: boolean) => {
  const date = new Date(timestamp);
  const day = date.getUTCDay();
  const dd = date.getUTCDate();
  const mm = date.getUTCMonth();
  const yyyy = date.getUTCFullYear().toString().slice(2);

  const dayFormat = (day: number) => {
    const days = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ];
    return days[day];
  };

  return withDaysName
    ? `${dayFormat(day)}, ${dd}/${mm}/${yyyy}`
    : `${dd}/${mm}/${yyyy}`;
};

export default dateFormatter;
