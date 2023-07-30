import { NormalRangeCheckerType } from '@/type';

const useColorCode = ({
  rangeBeat,
  rangeSpo2,
  rangeTemp
}: NormalRangeCheckerType): string => {
  switch (true) {
    case !rangeBeat && !rangeSpo2 && !rangeTemp:
      return 'bg-merah';
    case !rangeBeat && rangeSpo2 && rangeTemp:
    case !rangeBeat && !rangeSpo2 && rangeTemp:
    case !rangeBeat && rangeSpo2 && !rangeTemp:
    case rangeBeat && !rangeSpo2 && !rangeTemp:
    case rangeBeat && rangeSpo2 && !rangeTemp:
    case rangeBeat && !rangeSpo2 && !rangeTemp:
    case rangeBeat && !rangeSpo2 && rangeTemp:
      return 'bg-kuning';
    case rangeBeat && rangeSpo2 && rangeTemp:
      return 'bg-hijauTerang';
    default:
      return 'bg-abu';
  }
};

export default useColorCode;
