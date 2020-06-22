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

const showStatusElement = document.createElement('div');
showStatusElement.classList.add('extension-status');

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
  const mainWrapper = document.querySelector<HTMLElement>('#mainWrapBottom');
  if (!mainWrapper) return;
  mainWrapper.appendChild(showStatusElement);
  showStatusElement.innerHTML =
    'エラー: オートセーブが無効になってます。<br />ページを読み込み直してください';
  mainWrapper.style.position = 'relative';

  const lessonNameElement = document.querySelector<HTMLDivElement>('div.cpTgtName');
  const tableItems = document.querySelectorAll<HTMLElement>('table>tbody>tr>td');

  const lessonName = lessonNameElement?.textContent?.replace('ui-button', '');
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
  if (!lessonName || !assignmentName) return;

  const sharedKey = `${lessonName}_${assignmentName}`;

  const submitFormWrapper = document.querySelector('#funcForm\\:kdiTstAccordion');
  if (!submitFormWrapper) return;
  const submittedDataTable = createTable();
  submitFormWrapper.appendChild(submittedDataTable.body);

  let loadError = false;
  objectEntriesWithKeyType(textAreaData).forEach(([previousClassName, { elements }]) => {
    elements.forEach((element, i) => {
      element.classList.remove(previousClassName);
      const currentClassName = `extension-customed${previousClassName.replace(
        /^[a-z]/,
        (char) => char.toUpperCase(),
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

      const ownKey = `${sharedKey}_${previousClassName}_${i}`.replace(/\s+/g, '');

      try {
        chrome.storage.local.get((textDatas) => {
          if (textDatas[ownKey] === undefined) return;
          element.value = textDatas[ownKey];
          syncInitData();
        });
      } catch (error) {
        loadError = true;
        showStatusElement.style.display = 'block';
        showStatusElement.textContent =
          'デジキャン拡張-エラー: ローカル保存済テキスト読み込み失敗 ページを読み込み直してください';
      }

      element.addEventListener('input', () => {
        document.title = '保存中…';
      });
      const saveText = debounce(() => {
        try {
          chrome.storage.local.set({ [ownKey]: element.value });
          syncInitData();
          document.title = '保存完了';
        } catch (error) {
          showStatusElement.style.display = 'block';
          showStatusElement.textContent =
            'デジキャン拡張-エラー: 保存失敗 ページを読み込み直してもう一度入力してください';
        }
      }, 500);
      element.addEventListener('input', saveText);
    });
  });
  document.title = 'オートセーブ: 有効';
  if (loadError) return;
  showStatusElement.style.display = 'none';
};

const changeObserver = new MutationObserver(main);
changeObserver.observe(document.body, {
  childList: true,
});
