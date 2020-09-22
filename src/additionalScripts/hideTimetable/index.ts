import { configDisplayOfTable, TableDisplayConfigration } from './configTableDisplay';

const main = () => {
  const tables = document.querySelectorAll<HTMLDivElement>('.ofAuto');
  if (tables.length === 0) return;
  const tableDisplayConfigration = configDisplayOfTable();
  tables.forEach((tableElement) => {
    const tableTitle = tableElement.childNodes[0].childNodes[0].textContent;
    const tableSemester = ((): keyof TableDisplayConfigration | null => {
      if (tableTitle?.includes('(前期)')) {
        return 'firstSemester';
      } else if (tableTitle?.includes('(後期)')) {
        return 'secondSemester';
      } else {
        return null;
      }
    })();
    if (!tableSemester) return;
    if (!tableDisplayConfigration[tableSemester]) {
      tableElement.style.display = 'none';
    }
  });
};

main();
const changeObserver = new MutationObserver(main);
changeObserver.observe(document.body, {
  childList: true,
});
