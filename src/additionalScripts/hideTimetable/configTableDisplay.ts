export interface TableDisplayConfigration {
  firstSemester: boolean;
  secondSemester: boolean;
}

export const configDisplayOfTable = (): TableDisplayConfigration => {
  const nowDate = new Date(Date.now());
  const nowMonth = nowDate.getMonth() + 1;
  return {
    firstSemester: nowMonth >= 3 && nowMonth <= 8,
    secondSemester: nowMonth <= 3 || nowMonth >= 8,
  };
};
