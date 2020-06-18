import { debounce } from '../utils/debounce';

interface TextAreaData {
  element: HTMLTextAreaElement | null;
  previousClassName: 'editorContent' | 'commentContent';
  currentClassName: string;
}

const script = () => {
  const editorTextarea = document.querySelector<HTMLTextAreaElement>(
    'textarea.editorContent',
  );
  const commentTextarea = document.querySelector<HTMLTextAreaElement>(
    'textarea.commentContent',
  );
  if (!editorTextarea && !commentTextarea) return;

  const lessonNameElement = document.querySelector<HTMLDivElement>('div.cpTgtName');
  const tableItems = document.querySelectorAll<HTMLElement>(
    '#funcForm\\:kdiTstAccordion\\:j_idt337>tbody>tr>td',
  );
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

  const textAreaDataList: TextAreaData[] = [
    {
      element: editorTextarea,
      previousClassName: 'editorContent',
      currentClassName: 'customedEditorContent',
    },
    {
      element: commentTextarea,
      previousClassName: 'commentContent',
      currentClassName: 'customedCommentContent',
    },
  ];

  textAreaDataList.forEach(({ element, previousClassName, currentClassName }) => {
    if (element === null) return;
    element.classList.remove(previousClassName);
    element.classList.add(currentClassName);

    const ownKey = `${sharedKey}${previousClassName}`;

    chrome.storage.local.get((textDatas) => {
      if (!textDatas[ownKey]) return;
      const prevDataPlace = (() => {
        switch (previousClassName) {
          case 'editorContent':
            return '課題回答欄';
          case 'commentContent':
            return 'コメント欄';
        }
      })();
      if (confirm(`${prevDataPlace}に前回のデータがあるようです。復元しますか？`)) {
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
};

const changeObserver = new MutationObserver(script);
changeObserver.observe(document.body, {
  childList: true,
});
