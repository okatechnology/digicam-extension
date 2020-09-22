import { tableClassNames, tableWrapperClassNames } from '../../data/tableClassNames';

export const createTable = () => {
  const tableWrapper = document.createElement('div');
  tableWrapper.classList.add(...tableWrapperClassNames);
  const table = document.createElement('table');
  table.classList.add(...tableClassNames);
  const tBody = document.createElement('tbody');
  tableWrapper.appendChild(table);
  table.appendChild(tBody);

  return {
    body: tableWrapper,
    trContainer: tBody,
  };
};
