setTimeout(() => {
  const mainFrame = document.querySelector('#mainFrame');
  const mainDocument = mainFrame.contentWindow.document;

  const inputBufferFrame = document.querySelector('#mainFrame').contentWindow.document.querySelector('iframe');
  const inputBuffer = inputBufferFrame.contentWindow.document.body;

// 컨텐츠 요소들을 포함하는 상위 뢔퍼
  const contentLineWrapper = document.querySelector('#mainFrame').contentWindow.document.querySelector('article');
  const currentLineList = [];

  let isCommanderOn = false;

  const detectInputAndNewLine = (event) => {
    contentLineWrapper.querySelectorAll('p.se-text-paragraph').forEach((line, i) => {
      if (currentLineList.indexOf(line) == -1 && currentLineList.length > 0) {
        console.log('새로운 라인이 추가되었습니다');

        clearFormat();
      }

      currentLineList.push(line);
    });
  };

  contentLineWrapper.addEventListener('DOMSubtreeModified', detectInputAndNewLine);


  inputBuffer.oninput = (event) => {
    const text = event.target.textContent;

    if (text === '```') {
      toggleSourceCode();
      return false;
    }
  };

  inputBuffer.onkeydown = (event) => {
    const text = event.target.textContent;
    const keyCode = event.keyCode;

    console.log(`'${text}'`, keyCode);

    if((keyCode === 191 && !(event.shiftKey)) || (text.endsWith('/')) && !isCommanderOn) {

      // 슬래시는 버퍼에서 지우개 입력된척하기
      let minDiff = 10000;
      let minIndex = 10000;

      const allLines = contentLineWrapper.querySelectorAll('p.se-text-paragraph');

      allLines.forEach((line, i) => {
        // i === 0 은 제목 엘리먼트 인덱스
        if (i === 0) return;

        const currentCaretTop = mainDocument.querySelectorAll('.se-caret')[1].getClientRects()[0].top + 6;

        if (line.getClientRects().length < 1) return;
        const currentLineTop = line.getClientRects()[0].top;

        const diffBetweenCaretAndLine = Math.abs(currentCaretTop - currentLineTop);

        console.log('diff', i, diffBetweenCaretAndLine, currentLineTop, currentCaretTop);

        if (diffBetweenCaretAndLine < minDiff) {
          console.log('기록 갱신');
          minDiff = diffBetweenCaretAndLine;
          minIndex = i;
        }
      });

      console.log(allLines.length, minIndex, allLines[minIndex], allLines[minIndex].querySelector('span'));

      if (allLines[minIndex]) {
        allLines[minIndex].querySelector('span').textContent = `${allLines[minIndex].querySelector('span').textContent}/`;
      } else {
        console.log('현재 커서의 텍스트를 찾지 못했습니다.');
      }

      showCommander();

      return false;
    } else if (keyCode === 13) {
      return;
    } else {
      // 커맨드 툴이 입력되지 않고, 새로운 문자열이 입력되어 닫힘
      if (isCommanderOn) {
        console.log('커맨드 툴이 입력되지 않고, 새로운 문자열이 입력되어 닫힘');
        inputBufferFrame.contentWindow.document.execCommand('insertText', false, '/');

        hideCommander();
      }
    }

    if (keyCode !== 32 && !(text.match(/\s$/))) {
      console.log('스페이스바 아님'); 
      return;
    } else {
      console.log('스페이스바 눌림');
    }

    switch (true) {
      case text.startsWith('###'):
        setHeader3();
        break;

      case text.startsWith('##'):
        setHeader2();
        break;

      case text.startsWith('#'):
        console.log('header')
        setHeader1();
        break;

      default:
        return true;
    }

    if ((text.match(/\s$/))) {
      inputBufferFrame.contentWindow.document.execCommand('delete', false, null);
    }

    return false;
  };

  const clearFormat = () => {
    setTimeout(() => {
      mainDocument.querySelector('.se-font-size-code-toolbar-button').click();
      mainDocument.querySelector('.se-toolbar-option-font-size-code-fs15-button').click();
    }, 100);
  };

  const setHeader1 = () => {
    console.log('Header 1');
    inputBufferFrame.contentWindow.document.execCommand('delete', false, null);

    setTimeout(() => {
      mainDocument.querySelector('.se-font-size-code-toolbar-button').click();
      mainDocument.querySelector('.se-toolbar-option-font-size-code-fs34-button').click();
    }, 100);
  };

  const setHeader2 = () => {
    console.log('Header 2');
    inputBufferFrame.contentWindow.document.execCommand('delete', false, null);
    inputBufferFrame.contentWindow.document.execCommand('delete', false, null);

    setTimeout(() => {
      mainDocument.querySelector('.se-font-size-code-toolbar-button').click();
      mainDocument.querySelector('.se-toolbar-option-font-size-code-fs24-button').click();
    }, 100);
  };

  const setHeader3 = () => {
    console.log('Header 3');
    inputBufferFrame.contentWindow.document.execCommand('delete', false, null);
    inputBufferFrame.contentWindow.document.execCommand('delete', false, null);
    inputBufferFrame.contentWindow.document.execCommand('delete', false, null);

    setTimeout(() => {
      mainDocument.querySelector('.se-font-size-code-toolbar-button').click();
      mainDocument.querySelector('.se-toolbar-option-font-size-code-fs19-button').click();
    }, 100);
  };

  const toggleSourceCode = () => {
    console.log('Source Code');

    inputBufferFrame.contentWindow.document.execCommand('delete', false, null);
    inputBufferFrame.contentWindow.document.execCommand('delete', false, null);
    inputBufferFrame.contentWindow.document.execCommand('delete', false, null);

    mainDocument.querySelector('button.se-document-toolbar-icon-select-button').click();
  };

  const deleteLastByte = () => {
    // todo
  };

  const commanderToolList = [
    {
      name: '사진',
      desc: '사진을 입력합니다.',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAIAAABuYg/PAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDMtMTdUMTc6NTU6NTgrMDk6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMDMtMTdUMTc6NTU6NTgrMDk6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTAzLTE3VDE3OjU1OjU4KzA5OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmRlMTkzZTA1LWQ4MTYtNDdmNS1hY2Q3LTlmZDcxM2U5YTFjZCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjMxMWMwNjUzLTAyOTEtZWY0MS1iMDMxLTkwODA2YzgwNDRjZCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjgzMTdmMjcyLTJhZjMtNGQ3OS1hN2YwLTgwZjAxYTRkMmQyYSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODMxN2YyNzItMmFmMy00ZDc5LWE3ZjAtODBmMDFhNGQyZDJhIiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDE3OjU1OjU4KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZGUxOTNlMDUtZDgxNi00N2Y1LWFjZDctOWZkNzEzZTlhMWNkIiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDE3OjU1OjU4KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5q06EKAAADNklEQVRIie3XzUsiYRwH8Gfe0DGihoSig+ghPUySGUSJXSK6BF26JVPRoQ6KiJeivyAiaCqtyA6BEHXoEnTpEEQEWUMhFIqFlA5hEI4xE02OjXsY2I21F1s0tmW/l4Hn+c3zeV7gGQYaGxsDXxX4yyQAAKo8Jicny8qMj4+DL17Zf+z7YWipBjo/Pw8GgwAAiqJIkny1pmQrCwaDHMdxHKeQ5cWKSckwiqIIgiAIgqKot2pKdmYkSX54DX3PbSwZlkgkvgjb2NiYmpqKRqNlx7a2tnZ3dyVJWlxcvL6+LiO2s7Ozvb2NIIjJZBJFcW5uLpVKFTPoxcXF57D9/f3NzU0YhoeGhjweT1NTkyAINE2n0+n3pcPDw+np6b29vWKxo6OjtbU1AEB/f39raysMwyMjI0ajkeM4mqYFQXhLisViynW1vr5+dnb2MRYOh1dXV2VZ7uvr6+joUBpRFHU6nTqd7vb2dnZ2VhTFwhdTqdTS0lIul9PpdLIsBwIBlmXfw6LRaCAQeH5+7unp6e7uftmlVqvdbndtbW0ikfD7/blc7mUvz/Pz8/MPDw9Wq3ViYqKtrU0URZ/Pl8lkXsfi8fjCwoIkSZ2dnb29vYVzr6ys9Hg8BEHEYrHl5WVZlpV2SZL8fv/d3Z3BYBgeHoYgaGBgQNl2n8/39PSklCF2ux0A0NXVxbIsTdOiKNpsNofDUSgpwXGcJEmGYZLJZDqdtlgsAICVlZVIJKLVar1eL47jAAAYhi0WSzgcvrm5SSaTPM//wsxm88zMjCAILS0tytTewpT1mUwmhmGurq5EUYxEIgcHBxqNxuv11tTU/CzDMMxsNh8fH7Msm8/nMQxD7Ha7LMuhUOj+/r6xsXF0dBSGP75WqqurDQYDwzCXl5fxeBxBEJfLpdfrfyvTaDQNDQ2hUCibzUIQhNhsNp7nHx8fjUaj0+lE0WI/Olqttr6+/uTkJJ/PDw4OKvtZGIIg6urqTk9PcRxHs9msLMt6vd7lcmEYVqSkpLm52eFwZDKZ9vb2d8qsVmtVVRUAAFWr1RAEud1ulUr1KUmJcuRFBgYAqFSqioqKP5A+m7/v4/ktMeif/fP8AUPOVAlFCyfWAAAAAElFTkSuQmCC',
      className: '.se-image-toolbar-button'
    },
    {
      name: '동영상',
      desc: '동영상을 입력합니다.',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDMtMTdUMjA6Mzc6MzgrMDk6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMDMtMTdUMjA6Mzc6MzgrMDk6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTAzLTE3VDIwOjM3OjM4KzA5OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM0ODZiYTI3LTE5MTItNGQxYi04YzczLTMxOWJkMWEwOTAwMiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjM5YzJiMTg3LWY0Y2MtMzU0NC1hNjVhLTBiNjAxYmYzNTBlOSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjlkN2E1ZjE5LTY0ZjgtNDk4NS1hMzg3LThiMmJiYWMwYzAxMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OWQ3YTVmMTktNjRmOC00OTg1LWEzODctOGIyYmJhYzBjMDEwIiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjM3OjM4KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MzQ4NmJhMjctMTkxMi00ZDFiLThjNzMtMzE5YmQxYTA5MDAyIiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjM3OjM4KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5PlfQpAAACg0lEQVRYhe2YMWgUQRSGvzd7mwvcGc5CDmy0SGFEOxttUwkKSoJgoUVsLDRIqoAWESSkUlDBwiJgo4XBwoCVjQRtrDQYEWtJd8flDm4zu/MssnvuHXdcIHfrFflhGHg7O/vx3puZNyuqyijJ/G+ATh0C9dPIAeUAFhcXN4FjQGEI34iAJnALWAdQVcrlMkEQUKlUMGbPLysrK3tAwBTD9dZE3PoqAWoAR4DTQDhgmGngBRAkBhHpHHMWuAwsJ0CJd7YGDAMw2c0oIoiIB1wBXgICLHeGyR8CUGvOGAIRIQiC47u7u49F5C1wlNiDma6yJFQiMl2tVt/V6/V5Y8x6GjwzIBFJcnPJObemqucKhcKC7/vXY3se/iV1FjqjqjfCMJzxff+bc+627/tfwjBEVVveywxIVR+JSFAul5/v7OzcD4KgFkURzrm2vM0iZF7c/xwfH785Nzd3NwzDmjGGer1OFEVt28CBPdRlT2mTqgae530QkXngt7U2sXd9N4uQfTbGbAC1pPZSVXrVYVkAVbsZe3lo5E77LIBK7PNghWyALjjn3qjqZDpEvRbDgYGSBO3VgHwURRfDMHwPXPN9v+3dgQPtQ1Hcn2o2m69WV1ef5XK5CVWlWCzieV4bWJZn2QNgfXt7+4619hNw3vM8jDE2PS7LVbYpIrO5XO6hqp4ENqy190SkmM6nzIBUNdnzlowxMyLytdFoPLHWvo7t2ddDqZ36Y6lUulosFp865y7Fj203IMvg1Zozvfry+fyfsbGxBVWdBSp01EMu7qcYfJF/opsxBouANeAXe0V+Cyi5j/0YMExa+TRMh77HrQW0xfAvirX9DJbD3zF9dAjUTyMH9BdSRAsLloB6PgAAAABJRU5ErkJggg==',
      className: '.se-video-toolbar-button'
    },
    {
      name: '인용구',
      desc: '인용구를 입력합니다.',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDMtMTdUMjA6NDA6NTArMDk6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMDMtMTdUMjA6NDA6NTArMDk6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTAzLTE3VDIwOjQwOjUwKzA5OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY3ZmFkYjkxLWVkN2EtNGU0Yy04OWJlLWVlMjgxNzU3MGVlOSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjA5ZmZmMGNmLTg4OTktNDU0YS1hNDI3LWEwNzY0NzE3MTkyNCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjNkZGZkZWU4LTNhN2ItNGZlZi05ODdkLTY5ZDBhMzQ0MmE3ZSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6M2RkZmRlZTgtM2E3Yi00ZmVmLTk4N2QtNjlkMGEzNDQyYTdlIiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjQwOjUwKzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjdmYWRiOTEtZWQ3YS00ZTRjLTg5YmUtZWUyODE3NTcwZWU5IiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjQwOjUwKzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz52UC0/AAAEhklEQVRYhe2YX2hTVxjAf99Nqk3BluEcRNBNFlv7JGwMRhukDHvTO7qNbg+VoSGiuKcpwpA9bdncxMEY0z7N+VCmbLqXpcYRem/oBKWsiPOl0D60CLPpZKaCL4p4c789rLckMWnSu4f54PcUzp/f+d3v3HO+JKKqPE1h/N8C1fFMqGEEeYdM09yWSqVa/+va1RxVXXuGUqlUq6r+WigU/jBNc1tQmXqcNQstLCycUNVugM2bN/8VVKgeR1QVEWkKMjAw0Oe67gRQMgzjddu2bwSRqcdZ05ZZltXuuu4oICJyPKhMI07TQq7rfgu8CFzv7e09EUSmGU5TW9bf3/+2qo4BDw3DeMW27dkgMo04TW2ZZVmbgO8BDMP4OKhMs5yGQq7rfqeqL4jIxPj4+EgQmbVwVhVKJBJJVR0C7otISkQCVeK1cOoKmaa5pVQqnQYIhUKHbdu+HURmrZyaQqoqqjoKdIjIL+Pj4z8EkQnCqSmUSCQ+VNU3ROTvcDj8QRCZoJwnjv3AwECX67o3gYiIvOM4zqUgMkE4qloplE6nw9euXZsEXhORCVW9IyJdqhoRkYKqTkQikbPZbLa4GriKM6mqdwG/gN4SkVw4HB7N5XKPVhXq7+//RFU/Ax4CkTrrFUXksOM4P9UTKuM8BlpqjRGRWRE5YNv2ZE0h0zRf9TzvdyAEyMaNG3VoaEg6OzvZsGED8/PzXL16lampKR942nGcI9ULLXOm+Pf9lFgshmVZxGIxAObm5sjlcszNzSEiHnDAcZzRCqH9+/e3FgqFm6q6A6Cvr4+jR4/S1tb2xJNduXKFkydPaqlUEmA4n8//7PelUqnWhYWFaeBlgH379rF3714Mo/LseJ7H+fPnOXfuHMtZ3JnP52dWSsfi4mIUeA5g69atHDt2rKaML5tKpWQ5S1+W9y0uLkZFZBNAPB4nmUw+IQNgGAbJZJJdu3YBtIhIeqUPwLbtW8CfAMlkkpaWmtu+EsPDw7S3t6OqsUQisdNvD4VCi0AY4NChQ6syAA4ePOh/HLQsa/2KEICqdgJ0d3c3BIkIXV1d/rwdfrvneVtUta2jo4NoNNqQE41G6ejoQFXbPM/bUiEkImGAdevWNQQBK1n0PC9UxgiV962F488tz9A8wOxsc98u/HGGYcyXwW8Dj4vFIktLSw0ZS0tLFItFgMfLcytKxyWAixcvNvxp5DgO9+7dA7jT09Nz3W/PZrMPRCQPcOHChYZC/hgRyWez2QcVQpFI5BRwf3p6mjNnzuB5Xk3IzMwMIyMjugz6Ip1OVwwMhULHATKZDI7jrPpQmUymYg5U1TLTNN9S1YyqGtu3b2fPnj1UX4xjY2OqqgJk4vH4e9VCUHFT09PTw+DgYMXFePnyZSYnJ/3sfOo4zudQo3Qsw3qBs+WnpzxE5JGqHo/H41+l02m3XgZ27979PnAKeL7OkCJwJJ/P/+g31BQCsCxrfalUOqyq7wJdqhoBCiLym6p+k8/nZ+qJVHE2ua77EfCmqr603OwX169zudzd8vErQk9TPHX/fjwTahT/APmIel6WeNBvAAAAAElFTkSuQmCC',
      className: '.se-insert-quotation-default-toolbar-button'
    },
    {
      name: '장소',
      desc: '장소를 입력합니다.',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDMtMTdUMjA6NDI6MjgrMDk6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMDMtMTdUMjA6NDI6MjgrMDk6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTAzLTE3VDIwOjQyOjI4KzA5OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmFjMjAwYTkzLWViNGMtNGFjMy05YzQ2LTMzMWQ2MTlhZDE0NiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjNmYzlkZmEzLTkxYmItNWI0YS1hOTgxLWMxYWZkZjBiOWJlZiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjYwMDIyM2U5LTM5MDctNDg2ZS1iMmViLTExZDg3MmI1ZTU2YSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjAwMjIzZTktMzkwNy00ODZlLWIyZWItMTFkODcyYjVlNTZhIiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjQyOjI4KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YWMyMDBhOTMtZWI0Yy00YWMzLTljNDYtMzMxZDYxOWFkMTQ2IiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjQyOjI4KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5sIT22AAAGmUlEQVRYhe2YXWgb2RXH/6PRSKOJMlJGH8XYbIy1AmObyiZ9iI1D8Qd5U2JawhqWGG9hSUhx9wN5SyHQFvLQ9CP17oNDaEhQsmvKhjok6ZLYZvOwCt5NjAmxk7hYiYzBsSUU+WNW8ozm6/ahkdaKnbGjFnYf+od5Oeeec36698y9c0URQvBDkuX7BnhZ/wfaTlYz56lTp5BKpbC0tASapgEANE3jwIEDuwkhP75+/XrYarWGDMOoAACLxbKkadrUoUOH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',
      className: '.se-map-toolbar-button'
    },
    {
      name: '링크',
      desc: '링크를 입력합니다.',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDMtMTdUMjA6NDU6MTQrMDk6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMDMtMTdUMjA6NDU6MTQrMDk6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTAzLTE3VDIwOjQ1OjE0KzA5OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZjYWY3NDczLWVmMjYtNDMwNC04MTkzLWRiZTY5Nzc0ODg4OCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmI5MDQ2NjFhLThmMzEtNzM0Yi1hYjY1LTA0MzdjZjVjMjg4MCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmIzODIxNTI3LTNhNTYtNDBhMy04M2I3LTIyNzQ1NmEzN2Y4OSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjM4MjE1MjctM2E1Ni00MGEzLTgzYjctMjI3NDU2YTM3Zjg5IiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjQ1OjE0KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NmNhZjc0NzMtZWYyNi00MzA0LTgxOTMtZGJlNjk3NzQ4ODg4IiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjQ1OjE0KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5coAW4AAAEDklEQVRYhe2XX2hbVRzHv7+TmzS0SadUQUFcKSiMUdgcFKWTwry3lyQEGrDgoyCWdXuwA0HnmMYyrYIgA90kD3vxRdZBK8W0yc3GJsZhwTlQEfpQWvFhoBPb2DVp7r1fH5pIKfnXNGN92PfphPM93/Phl5PzOxGS2EtSDxpgux4C1dOeA9KqTYhIU4HhcPgJ27bfItlHsldElgH8qJS6kEql5su+aj8mqTrRBJBhGMMkLwLoqpDniMhH3d3d7ycSiWK1fVv2lem6PkbyMoAuEbmilOpvb2/vVEr1isg4Sdd13TOLi4vv1sppSYV0XR8FcAEAReSEZVlfbPcYhtFP8joAAjhiWdbPlbJ2XaHBwcHXAHxe+niyEgwAWJaVBfApAK+IvFEtb1dAuq6bJBMARETGMpnMxVp+j8fzFQCQPNxyoOHh4QCABEklImcsyzpfb01nZ+dCafhsy4FWVlbeBPC0iHybTqcnGlmTy+V6SsPFlgORPAoAInJORBrq0I7jDJWGt6t5ql6MDQAdAoCOjo5bjfh1XT9A8rSIuB6Pp+LBB3ZYoUgk8mgoFGoDABG5BwBra2vtuq4fNQzjm0gk0lNpXTgc3g9gDoAfwGdzc3M3dw0Ui8W6CoXCjWKx+H0sFutCqewknxeREZLhQqEwb5rmwa3rQqHQUxsbG9ewed6yfr//dK19GgIaGhp6JJfLpQH0AvDn83klInOl6Q+UUuMichVAl+u6l+LxuAIA0zSftG37GoAeEZnXNC08MzNzr9ZedW/qUCjUadu2RbIPwILP5xtIJpN34vG4ymazN0n2ichVpdRx13WTJJ9RSp0EcIXkdZIHANwKBAIvTU9P/1POb6q5RqPR9nw+nybZD2DR6/UOzM7O/lH2mKZ50HGcG9jsX18CmCF5WURmlFKvuq6bJukNBoPHpqam7m7Nb6q55vP5iRLM7z6f79hWGABIpVK/trW19YlIkmRC07TyYT2cSqX+1jStPxAIDGyHqaWqFQqFQi84jvMdyQ0Az2Uymd/qhUWj0cfW19f/BPBXJpN5vJZ3xxWybft4qS182AgMABQKhXKPut2If0dAAA4BgMfj+bqRIJLiuu5ZAFBKZe8HUA8ABIPBqn1nqwzDeAfAiwCW9+3b98n9AFoAgNXV1aqduSxd18cAnBMRV0RGJicn/205kIj8BACO47xSB2YUmw8visjrlmWlm4WpCUTyPIAigFOGYfTXgPn/tZhOpy/tBgaoczEahjFO8iyAoohMiMik3+9fzufzvSRPkXy55B1r5IG2VU3d1CMjI96lpaX3SL5N0lPBdldERi3LmtwJTNNAZZmm2ee67gkAR0juB/CLUuoHTdM+TiaTd3YK0xTQg9Ke+2//EKie9hzQfz0Y0KJDyVUpAAAAAElFTkSuQmCC',
      className: '.se-oglink-toolbar-button'
    },
    {
      name: '파일',
      desc: '일정을 입력합니다.',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDMtMTdUMjA6NDc6MDMrMDk6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMDMtMTdUMjA6NDc6MDMrMDk6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTAzLTE3VDIwOjQ3OjAzKzA5OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmQxZDJmMWJmLWZiODUtNDNhOS1iNzY4LTEzYzhmMTk0MmY1NiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjIxMWI5MzY2LWQyMDAtMzA0MS1hOTA2LTAyODc5ODVkYTg0NCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmMxNTQ0NjhhLTE5M2QtNGRmNi05YTFmLWJjMTA0ZDRjMDZmNiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YzE1NDQ2OGEtMTkzZC00ZGY2LTlhMWYtYmMxMDRkNGMwNmY2IiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjQ3OjAzKzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZDFkMmYxYmYtZmI4NS00M2E5LWI3NjgtMTNjOGYxOTQyZjU2IiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjQ3OjAzKzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4wLztVAAABkElEQVRYhe2Yu07DMBRAzw0pAysMiI9AiK0MfAD8BVIXQCwsFQ+xgNSFFXVi5gNAYoaBAbGAGBlBDLB3qHMZSFHqOmqaOCRDj2RZuU6uTxxbTiKqSp0IqhawmQqNo3ZCYfKg3W5nnuEicgoc+1gUnU7HLQQY4BY4cF2oqjQaDVS1a4zZFZEu8F7YKIEtNAN8Ac+uk0WEIAiIougMuAZOgMuCDgZ4TBMaSI2gqoRhSBiGqOqNMeZOVVtAy4PQn4dLKCtbwEpBmT2gmQwUEXqLSxE2gPVkoOplP2sHJh4hEfGjkkJmIREhiiJ6vR6qSlmb8kQjpKr0+33XKD3EddNuKFUIUh/ZfFGRAUVWWRLjKY83ochTnlxCS8CiFZuL61Ur/gl8lC10CGyntD1ZxxfATtlCXeDeip3H9b4Vf500eR6hl7gkOYrrqxz5hvA1qZ1vCHmoei8bwdcIebsxX0JrnvJ4E/r2lKd+c8gl5G1fysBIX67PoAVg+V90fvsaknJ9Bm3GpRJk+jtmDFOhcdRO6Ac9SV2tWjCOcQAAAABJRU5ErkJggg==',
      className: '.se-file-toolbar-button'
    },
    {
      name: '표',
      desc: '표를 입력합니다.',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDMtMTdUMjA6NDk6MTArMDk6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMDMtMTdUMjA6NDk6MTArMDk6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTAzLTE3VDIwOjQ5OjEwKzA5OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmU1ZTI1ODYyLWFkZDgtNGUyMy05MWI3LWQ4MjUzZWFhMWNhNyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjIyY2MzM2I4LWFhZTgtNWI0My05MTU1LTBlMGQ4ZTg2NmUxNyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjI2MjlhMGRiLTYxN2UtNDhlNS05YWNlLTYyYzJiZWZhMzVmZSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjYyOWEwZGItNjE3ZS00OGU1LTlhY2UtNjJjMmJlZmEzNWZlIiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjQ5OjEwKzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZTVlMjU4NjItYWRkOC00ZTIzLTkxYjctZDgyNTNlYWExY2E3IiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjQ5OjEwKzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7MCb0tAAAC3ElEQVRYhe2Yv2sUURDHP3vZ84zxBwkxAaNRiY0iqIiINoetgohYWglq7Y/STosrAqKd2BksbFQUQawUMdipf4CIaOMPsNAzP/Z2n8Wbl9t7mbcbYsQr7gvHbmbmzXx3Zt683UTGGLoJlf9NwEePUBl6hMrQdYSi2st69dKjQ4mJOJ1FZkrkLaDPs808WWhepEC8BLvI+W00Ggt+8wsTuV4GXgUIjQM3gIfAHc+xQwuYBHYDJ+RvH0b0t4BveUWekCvfG+C14gTgsxD/BEwHbAC+i92LAptM4aD20ECBk3XYzK1lcWbyqIrvaoHNoFw7Srrcpl6J80b1UUniNPNkaYGTljhKS0g5ndY/DokmjLd9HUxNp3eX7tizTYFVOVN375cuEZkB+gOktHWW0KnpXZgITGTcwgvAcaCmBBoGhoCTwPaA41lgL7bfbqNn0gBjcj/XQchUDCZbMEICbUDP0AA2g6MSVAuWAOtl/Z6ADWID7d1mCcVphSwy5AhcAZ4phDJgArgH3AVuBoK1gClgP3CMcB8dAB5gy9omJGSgnfov8tPQLySa2JkUwow8wMcCmwkvLqBve7938lgta2q+Iw99oi+aQ27ercgc+mfQCM0pModZbCnmKJ5Dbk6ps0bQlGtHprVTeVR+WlNvEgcDwOYAqRa21yrAVsJNPeTFXUTILbwGXFQIuW0/ApwBjgYIJcAOYA3wJGAD7W0/EyLkUvcBeE94MI5hd+FbwoNxBDvJ3wUIucE4jtc2sXJ/HXiMnqGdwFPgPnA1QCiR9QeBs4SPjjpwBO/B/aDOYQbMK7r5HAFNnw8YYcsRKpl+2isy/00xj1gCuTkTgtNpD+ygzqjlzqEiMn/lQyPUVGQOP7G99IviOeTKXjSHfmjE8il1p+4+4Dfhl/wqsAU4rDnENvGw2NUpfsnH1+cJuZpOUv4ZdB44pwSCzs+g55R/Bm3sEPb+HVOCHqEydB2hP5rIvbpCC6evAAAAAElFTkSuQmCC',
      className: '.se-table-toolbar-button'
    },
    {
      name: '수식',
      desc: '수식을 입력합니다.',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDMtMTdUMjA6NTE6MzcrMDk6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMDMtMTdUMjA6NTE6MzcrMDk6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTAzLTE3VDIwOjUxOjM3KzA5OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmM4NDg3YmM1LWJkZjktNDY1NC1iZDY1LTY2MzljYmE4ODJhMiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmQ5MjM3NWYyLTg4YmItNDQ0My1iNWIxLTE3ODcyOWJkYmVlNiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmFlNzg5NDQ2LTdlZTItNDVlNy1iYTI4LWQ1ZTA1Njk2YTZiMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YWU3ODk0NDYtN2VlMi00NWU3LWJhMjgtZDVlMDU2OTZhNmIwIiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjUxOjM3KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Yzg0ODdiYzUtYmRmOS00NjU0LWJkNjUtNjYzOWNiYTg4MmEyIiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE3VDIwOjUxOjM3KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5wwy+hAAADi0lEQVRYhe2YT2hjRRzHP795k9fmj9ssUkkP7kEreBM8COtJFPGye1jEvbjsWbyIKB687Ent3jaH9uieVLQiQpFWpd5EirQgKAUpUpUeUpqmhewmeZmZn4fmxSQt240k2EO/MOQx83vz+8z8fvN+70VUlbMk838DDOoc6DSdOSA77A3VapXbt2/TaDQoFAqM4lDMzc11r4feoe3tber1OsaMZ3OHmnVzc5OtrS0mJyfHAgOnhGxvb4/V1VXiOEZEAMhms4jI08CjI+T48VQg7z1LS0vs7Oxg7b9mIvJIq9X6xlr7xAiB5IFAzjnm5+dZW1sjm80ODr9sjJkxxtxQ1fURQp0M5JyjXC6zvr5OPp/vGxMRROQqsNdsNj+J45hMJjOSk3YMaGFhgcPDQ4wxVKtVZmdn+xyJCEmSTO/v779kjPlcRGg0Gn3hHCnQxsYGzjmy2SzFYpEkSfoMRYQQwnPA48aYT1WVKIpGCtMHFMcx1lqiKKJer2OtPRaKZrN5U0R+CSH8nslkyOfzqOqLwNvABXqS8yHUBP4A3ujtNAAHBwd9llEUYYwZbEXgShRFX8dxfC+O49T8SeAKkBkCBuBZ4Ppgp11cXGRlZYWJiQngKDTee9rtdvfZA+C9v6qqAfjOOdcbLtf5fX5IoA+ANwc7zfLychcmlYj0lQY5IrtmjPkrjuOfrLUnlY7CkECTwLHjaU4qA50E7oKp6iXv/WXgS+ecpgk9jrfNwWVeBERVsdZ2mzHmsoiUoij6TFWP7eBYgFT1MVX9PoRw03uPc452u02SJCRJ8jqwFkLYCiEQQhgLTB+QiNRFZM97/5H3/mIaFmvtNPAKsOiOhPe+L+HHAqSq91X1nc5OvVcsFnHO0Ww2X1PV+8Bqp3SQyQx7wocAUlXSJiK/icgdVX1LVZ/qOH41iqLNQqHwaz6fp1AokMvlxpLQACZddalUYmZmhunp6Q9F5KBWq91qtVqzqvqMqn4VQnBp/ozzW86mk6dgIrIvIrdU9Q6QEZELU1NTX6Q3PADm3pC+25xQarpAlUoFEUkdfqyqN4DrxphvrbV/pklsjCFJkl6w9OIFoDEE0KUOVD9QqVQCoFar9fZ7VX233W6/H0K4u7u7e+RZlVwuRy6X67VNV/nDEDCp/j4GlK68XC4Pjv0MXHuISe922khkK5XKqOYaiew4nyn/RXL+d8wpOgc6TWcO6B95TIk77hV1+AAAAABJRU5ErkJggg==',
      className: '.se-formula-toolbar-button'
    },
  ];

  const toggleCommander = () => {
    const smartEditorContainer = mainDocument.querySelector('#drag-ghost');

    smartEditorContainer.innerHTML += `
        <section class="gep-commander">
            <input class="gep-hidden-input" type="text" hidden>
            <h3 class="gep-commander-title">유용한 기능</h3>
            <div style="height: calc(100% - 30px); overflow-y: scroll;" class="tool-wrapper">
                <ul class="gep-commander-list">
                </ul>
            </div>
        </section>
    `;

    // 포커스 가로채기
    const hiddenInput = mainDocument.querySelector('.gep-hidden-input');
    hiddenInput.blur();
    hiddenInput.focus();

    // 커맨더 스타일링
    const commanderStyle = mainDocument.querySelector('.gep-commander').style;

    commanderStyle.position = 'absolute';
    commanderStyle.top = '50%';
    commanderStyle.left = '50%';
    commanderStyle.borderRadius = '10px';

    commanderStyle.width = '200px';
    commanderStyle.height = '300px';
    commanderStyle.border = '1px solid #bdbdbd';

    commanderStyle.zIndex = 100;

    commanderStyle.background = 'white';

    // 제목 스타일링
    const commanderTitle = mainDocument.querySelector('.gep-commander-title');
    commanderTitle.style.width = '100%';
    commanderTitle.style.height = '20px';
    commanderTitle.style.color = 'black';
    commanderTitle.style.fontSize = '14px';
    commanderTitle.style.fontWeight = 'bold';
    commanderTitle.style.marginLeft = '10px';
    commanderTitle.style.marginTop = '10px';

    // 툴 목록 추가
    const commanderList = mainDocument.querySelector('.gep-commander-list');
    let listHTML = '';
    for (const { name, desc, image} of commanderToolList) {
      listHTML += `
            <li class="gep-commander-tool" style="width: 100%; height: 50px; lineheight: 50px; padding-left: 10px;">
                <div style="position: relative; top: 9.5px;">
                    <img style="display: inline-block;" src="${image}" height="18" width="18">
                    <div style="display: inline-block; margin-left: 5px;">
                        <strong style="display: inline-block; font-size:14px;">${name}</strong>
                        <span style="display: block; margin-top: 5px; color: #a9a9a9">${desc}</span>
                    </div>
                </div>
            </li>
       `;
    }

    commanderList.innerHTML = listHTML;
    commanderList.style.margin = '10px auto 5px auto';
    commanderList.style.overflowX = 'hidden';

    const toolList = mainDocument.querySelectorAll('.gep-commander-tool');
    for (let i = 0, len = toolList.length; i < len; i += 1) {
      const tool = toolList[i];

      tool.onmouseover = () => {
        toolList.forEach(tool => {
          tool.style.backgroundColor = 'white';
          tool.querySelector('strong').style.color = 'black';
          tool.querySelector('span').style.color = 'rgb(169, 169, 169)';
        });

        tool.style.backgroundColor = '#00c73c';

        // 툴 텍스트 변경
        tool.querySelector('strong').style.color = 'white';
        tool.querySelector('span').style.color = 'white';
      };

      tool.onmouseout = () => {
        tool.style.background = 'none';

        // 툴 텍스트 변경
        tool.querySelector('strong').style.color = 'black';
        tool.querySelector('span').style.color = '#a9a9a9';
      };

      tool.onclick = () => {
        hideCommander();
        console.log(commanderToolList[i].className);
        mainDocument.querySelector(commanderToolList[i].className).click();

        console.log('툴 클릭');
      };
    }
  };


  let currentCommandIndex = 0;

  inputBuffer.onkeyup = (event) => {
    const text = event.target.textContent;
    const keyCode = event.keyCode;

    console.log('keyup');
    console.log(keyCode);

    if (!isCommanderOn) {
      return false;
    };

    const toolWrapper = mainDocument.querySelector('.tool-wrapper');
    const toolList = mainDocument.querySelectorAll('.gep-commander-tool');

    // 엔터 클릭
    if (keyCode === 13) {
      inputBufferFrame.contentWindow.document.execCommand('delete', false, null);

      setTimeout(() => {
        runSelectedTool();
        hideCommander();
      }, 100);

      // 혹시 문제가 생기면 preventDefault 때문일 수 있으니 stopPropagation 으로 바꿔보기
      event.stopPropagation();
      clearFormat();
      return false
    }

    clearToolHighlight();

    switch(keyCode) {
      case 37:
        console.log('커맨드 Left');
        break;

      case 38: {
        currentCommandIndex = currentCommandIndex > 0 ? currentCommandIndex - 1 : 0;
        const currentTool = toolList[currentCommandIndex];

        // currentTool.scrollIntoView();
        scorllIfNotInScroll(currentTool);
        currentTool.onmouseover();

        console.log('커맨드 Up', currentCommandIndex);
        event.stopPropagation();

        return false;
      }

      case 39:
        console.log('커맨드 Right');
        break;

      case 40: {
        currentCommandIndex = currentCommandIndex < commanderToolList.length - 1 ? currentCommandIndex + 1 : currentCommandIndex;
        const currentTool = toolList[currentCommandIndex];

        // currentTool.scrollIntoView();
        scorllIfNotInScroll(currentTool);
        currentTool.onmouseover();

        console.log('커맨드 Down', currentCommandIndex);
        event.stopPropagation();

        return false;
      }
    }
  };

  const clearToolHighlight = () => {
    const toolList = mainDocument.querySelectorAll('.gep-commander-tool');

    for (const tool of toolList) {
      tool.onmouseout();
    }
  };

  const runSelectedTool = () => {
    const toolList = mainDocument.querySelectorAll('.gep-commander-tool');

    console.log(`${currentCommandIndex}번 툴 실행`);
    deleteCommandSlash();

    toolList[currentCommandIndex].click();
  };

  const hideCommander = () => {
    console.log('커맨더 hide');
    const commander = mainDocument.querySelector('.gep-commander');

    if (commander) {
      commander.style.display = 'none';
    }

    isCommanderOn = false;
    currentCommandIndex = 0;
  };

  const showCommander = () => {
    console.log('커맨더 show');
    const commander = mainDocument.querySelector('.gep-commander');

    if (commander) {
      commander.style.display = 'block';
    } else {
      toggleCommander();
    }

    clearToolHighlight();

    const firstTool = mainDocument.querySelector('.gep-commander-tool');
    firstTool.onmouseover();
    firstTool.scrollIntoView();

    isCommanderOn = true;
    currentCommandIndex = 0;
  }


  const scorllIfNotInScroll = (element) => {
    const scroll = mainDocument.querySelector('.gep-commander');

    if (!isElementVisible(element, scroll)) {
      element.scrollIntoView();
    }
  };

  /* 유틸리티 함수 */
// 해당 엘리먼트가 전부 스크롤안에 보이는지 여부 조회
  function isElementVisible (el, holder) {
    holder = holder || mainDocument.body
    const { top, bottom, height } = el.getBoundingClientRect()
    const holderRect = holder.getBoundingClientRect()

    return top >= holderRect.top && top <= holderRect.bottom && bottom <= holderRect.bottom && bottom >= holderRect.top;
  }

  const deleteCommandSlash = () => {
    let minDiff = 10000;
    let minIndex = 10000;

    const allLines = contentLineWrapper.querySelectorAll('p.se-text-paragraph');

    allLines.forEach((line, i) => {
      // i === 0 은 제목 엘리먼트 인덱스
      if (i === 0) return;

      const currentCaretTop = mainDocument.querySelectorAll('.se-caret')[1].getClientRects()[0].top + 6;

      if (line.getClientRects().length < 1) return;
      const currentLineTop = line.getClientRects()[0].top;

      const diffBetweenCaretAndLine = Math.abs(currentCaretTop - currentLineTop);

      console.log('diff', i, diffBetweenCaretAndLine, currentLineTop, currentCaretTop);

      if (diffBetweenCaretAndLine < minDiff) {
        console.log('기록 갱신');
        minDiff = diffBetweenCaretAndLine;
        minIndex = i;
      }
    });

    console.log(allLines.length, minIndex, allLines[minIndex], allLines[minIndex].querySelector('span'));

    if (allLines[minIndex]) {
      const text = allLines[minIndex].querySelector('span').textContent;

      if (text.endsWith('/')) {
        allLines[minIndex].querySelector('span').textContent = text.slice(0, text.length - 1);
      }

    } else {
      console.log('현재 커서의 텍스트를 찾지 못했습니다.');
    }
  }

// TODO insertCommandSlash

}, 1000);
