export const calculateMinimumFloor = (km: number, axes: number): number => {
  let floor = 0.0;

  if (km <= 0.0 || axes <= 0) return floor;

  switch (axes) {
    case 4:
      floor = km * 2.3041;
      break;
    case 5:
      floor = km * 2.7446;
      break;
    case 6:
      floor = km * 3.1938;
      break;
    case 7:
      floor = km * 3.3095;
      break;
    case 9:
      floor = km * 3.6542;
      break;
  }

  return floor;
};
