import {
  labelClassNames,
  tdLeftClassNames,
  tdRightClassNames,
  trClassNames,
  textAreaClassNames,
} from '../data/tableClassNames';

export const createTableRow = (headerName: string, contents: string) => {
  const tr = document.createElement('tr');
  tr.classList.add(...trClassNames);
  const tdLeft = document.createElement('td');
  tdLeft.classList.add(...tdLeftClassNames);
  const tdRight = document.createElement('td');
  tdRight.classList.add(...tdRightClassNames);
  const label = document.createElement('label');
  label.classList.add(...labelClassNames);
  const textBox = document.createElement('div');
  textBox.classList.add(...textAreaClassNames);

  label.textContent = headerName;
  textBox.textContent = contents;
  textBox.style.lineHeight = 'normal';

  tr.appendChild(tdLeft);
  tr.appendChild(tdRight);
  tdLeft.appendChild(label);
  tdRight.appendChild(textBox);
  return tr;
};
