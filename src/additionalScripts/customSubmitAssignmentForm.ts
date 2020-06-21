import { debounce } from '../utils/debounce';
import { objectEntriesWithKeyType } from '../utils/objectEntriesWithKeyType';
import { createTable } from './createTableContainer';
import { createTableRow } from './createTableRow';
import { syncInitData } from './syncInitData';

type PreviousClassName = 'editorContent' | 'commentContent';
interface TextAreaDataPart {
  elements: NodeListOf<HTMLTextAreaElement>;
}
type TextAreaData = {
  [K in PreviousClassName]: TextAreaDataPart;
};

const main = () => {
  const editorTextArea = document.querySelectorAll<HTMLTextAreaElement>(
    'textarea.editorContent',
  );
  const commentTextArea = document.querySelectorAll<HTMLTextAreaElement>(
    'textarea.commentContent',
  );
  if (editorTextArea.length === 0 && commentTextArea.length === 0) return;

  const textAreaData: TextAreaData = {
    editorContent: {
      elements: editorTextArea,
    },
    commentContent: {
      elements: commentTextArea,
    },
  };

  const lessonNameElement = document.querySelector<HTMLDivElement>('div.cpTgtName');
  const tableItems = document.querySelectorAll<HTMLElement>('table>tbody>tr>td');
  const lessonNumber = lessonNameElement?.textContent?.replace(/\D/g, '');
  const assignmentName = (() => {
    for (const property in tableItems) {
      const index = parseInt(property);
      if (isNaN(index)) continue;
      if (tableItems[index].textContent === '課題名') {
        return tableItems[index + 1].textContent;
      }
    }
    return null;
  })();
  if (!lessonNumber || !assignmentName) return;
  const sharedKey = `${lessonNumber}${assignmentName}`;

  const submitFormWrapper = document.querySelector('#funcForm\\:kdiTstAccordion');
  if (!submitFormWrapper) return;
  const submittedDataTable = createTable();
  submitFormWrapper.appendChild(submittedDataTable.body);

  objectEntriesWithKeyType(textAreaData).forEach(([previousClassName, { elements }]) => {
    elements.forEach((element, i) => {
      element.classList.remove(previousClassName);
      const currentClassName = `customed${previousClassName.replace(/^[a-z]/, (char) =>
        char.toUpperCase(),
      )}`;
      element.classList.add(currentClassName);
      const submittedDataLabelName = (() => {
        switch (previousClassName) {
          case 'editorContent':
            return '提出済提出内容';
          case 'commentContent':
            return '提出済コメント';
          default:
            return '';
        }
      })();
      const submittedData = element.value;
      submittedDataTable.trContainer.appendChild(
        createTableRow(submittedDataLabelName, submittedData),
      );

      const ownKey = `${sharedKey}${previousClassName}${i}`.replace(/\s/, '_');
      chrome.storage.local.get((textDatas) => {
        element.value = textDatas[ownKey];
        syncInitData();
      });

      element.addEventListener('input', () => {
        document.title = '保存中…';
      });
      const saveText = debounce(() => {
        chrome.storage.local.set({ [ownKey]: element.value });
        syncInitData();
        document.title = '保存完了';
      }, 500);
      element.addEventListener('input', saveText);
    });
  });
  document.title = 'オートセーブ待機中…';
};

const changeObserver = new MutationObserver(main);
changeObserver.observe(document.body, {
  childList: true,
});
