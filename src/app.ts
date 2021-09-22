import { MediaSectionInput } from './components/dialog/input/media-input.js';
import { InputDialog } from './components/dialog/dialog.js';
import { VideoComponent } from './components/page/item/video.js';
import { TodoComponent } from './components/page/item/todo.js';
import { NoteComponent } from './components/page/item/note.js';
import { ImageComponent } from './components/page/item/image.js';
import { Composable, PageComponent, PageItemComponent } from './components/page/page.js';
import { Component } from './components/component.js';
import { TextSectionInput } from './components/dialog/input/text-input.js';

class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement, dialogRoot: HTMLElement) {
    // 이제 다크모드 페이지나 다른 종류의 페이지 컴포넌트를 생성자에 전달만 해주면 다른 타입의 아이템을 만들 수 있다.
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    const imageBtn = document.querySelector('#new-image')! as HTMLButtonElement;
    imageBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const inputSection = new MediaSectionInput();
      dialog.addChild(inputSection);
      dialog.attachTo(dialogRoot);
// dialogRoot로 바꿔주면 document.body가 아니라 다른곳에서 추가, 제거하고 싶을 때, 한 군데에서만 변경하면 된다.
      dialog.setOnCloseListenr(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnSubmitListenr(() => {
        // 섹션을 만들어서 페이지에 추가 해준다
        const image = new ImageComponent(inputSection.title, inputSection.url);
        this.page.addChild(image);
        dialog.removeFrom(dialogRoot);
      });
    });

    const videoBtn = document.querySelector('#new-video')! as HTMLButtonElement;
    videoBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const inputSection = new MediaSectionInput();
      dialog.addChild(inputSection);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListenr(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnSubmitListenr(() => {
        const image = new VideoComponent(inputSection.title, inputSection.url);
        this.page.addChild(image);
        dialog.removeFrom(dialogRoot);
      });
    });

    const noteBtn = document.querySelector('#new-note')! as HTMLButtonElement;
    noteBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const inputSection = new TextSectionInput();
      dialog.addChild(inputSection);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListenr(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnSubmitListenr(() => {
        const image = new NoteComponent(inputSection.title, inputSection.body);
        this.page.addChild(image);
        dialog.removeFrom(dialogRoot);
      });
    });

    const todoBtn = document.querySelector('#new-todo')! as HTMLButtonElement;
    todoBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const inputSection = new TextSectionInput();
      dialog.addChild(inputSection);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListenr(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnSubmitListenr(() => {
        const image = new TodoComponent(inputSection.title, inputSection.body);
        this.page.addChild(image);
        dialog.removeFrom(dialogRoot);
      });
    });
  }
}
// dialogRoot로 바꿔주면 document.body가 아니라 다른곳에서 추가, 제거하고 싶을 때, 한 군데에서만 변경하면 된다.
new App(document.querySelector('.document')! as HTMLElement, document.body);
