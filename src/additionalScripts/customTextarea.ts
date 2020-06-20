import { debounce } from '../utils/debounce';
import { objectEntriesWithKeyType } from '../utils/objectEntriesWithKeyType';

type PreviousClassName = 'editorContent' | 'commentContent';
interface TextAreaDataPart {
  elements: NodeListOf<HTMLTextAreaElement>;
}
type TextAreaData = {
  [K in PreviousClassName]: TextAreaDataPart;
};

const script = () => {
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
    let finishLoopFlag = false;
    for (let i = 0; i < tableItems.length; i++) {
      if (finishLoopFlag) {
        return tableItems[i].textContent;
      }
      if (tableItems[i].textContent === '課題名') {
        finishLoopFlag = true;
      }
    }
    return null;
  })();

  if (!lessonNumber || !assignmentName) return;
  const sharedKey = `${lessonNumber}${assignmentName}`;

  objectEntriesWithKeyType(textAreaData).forEach(([previousClassName, { elements }]) => {
    elements.forEach((element, i) => {
      element.classList.remove(previousClassName);
      const currentClassName = `customed${previousClassName.replace(/^[a-z]/, (char) =>
        char.toUpperCase(),
      )}`;
      element.classList.add(currentClassName);

      const ownKey = `${sharedKey}${previousClassName}${i}`;

      chrome.storage.local.get((textDatas) => {
        if (!textDatas[ownKey]) return;
        const prevDataPlace = (() => {
          switch (previousClassName) {
            case 'editorContent':
              return '課題回答欄';
            case 'commentContent':
              return 'コメント欄';
            default:
              return 'テキスト入力欄';
          }
        })();
        const textBoxNumber = i > 0 ? i + 1 : '';
        if (
          confirm(
            `${prevDataPlace}${textBoxNumber}に前回のデータがあるようです。復元しますか？`,
          )
        ) {
          element.value = textDatas[ownKey];
        }
      });

      element.addEventListener('input', () => {
        document.title = '保存中…';
      });
      const saveText = debounce(() => {
        chrome.storage.local.set({ [ownKey]: element.value });
        document.title = '保存完了';
      }, 1000);
      element.addEventListener('input', saveText);
    });
  });
  document.title = 'オートセーブ待機中…';
};

const changeObserver = new MutationObserver(script);
changeObserver.observe(document.body, {
  childList: true,
});
