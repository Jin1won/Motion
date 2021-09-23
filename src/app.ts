import { MediaSectionInput } from './components/dialog/input/media-input.js';
import { InputDialog, MediaData, TextData } from './components/dialog/dialog.js';
import { VideoComponent } from './components/page/item/video.js';
import { TodoComponent } from './components/page/item/todo.js';
import { NoteComponent } from './components/page/item/note.js';
import { ImageComponent } from './components/page/item/image.js';
import { Composable, PageComponent, PageItemComponent } from './components/page/page.js';
import { Component } from './components/component.js';
import { TextSectionInput } from './components/dialog/input/text-input.js';

type InputComponentConstructor<T = (MediaData | TextData) & Component> = {
  new ():T;
}
class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    // 이제 다크모드 페이지나 다른 종류의 페이지 컴포넌트를 생성자에 전달만 해주면 다른 타입의 아이템을 만들 수 있다.
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    this.bindElementToDialog<MediaSectionInput>(
      '#new-image',
      MediaSectionInput, 
      (input:MediaSectionInput) => new ImageComponent(input.title, input.url)
    );
      
    this.bindElementToDialog<MediaSectionInput>(
      '#new-video',
      MediaSectionInput, 
      (input:MediaSectionInput) => new VideoComponent(input.title, input.url)
    );

    this.bindElementToDialog<TextSectionInput>(
      '#new-note',
      TextSectionInput, 
      (input:TextSectionInput) => new NoteComponent(input.title, input.body)
    );

    this.bindElementToDialog<TextSectionInput>(
      '#new-todo',
      TextSectionInput, 
      (input:TextSectionInput) => new TodoComponent(input.title, input.body)
    );
  }
  
  // section을 만들기 위해 constructor를 전달할 수 있다.
  // private bindElementToDialog<T extends MediaSectionInput | TextSectionInput>(
  // 여기서 위와 같이 타입을 MediaSectionInput TextSectionInput를 써서 타입을 정하면 커플링이 발생하기 때문에 이를 인터페이스로 대체해준다.
  // 그리고 꼭 Component형태여야 하므로 & Component를 붙여준다.
  private bindElementToDialog<T extends (MediaData | TextData) & Component>(
    selector:string,
    InputComponent:InputComponentConstructor<T>,  
    makeSection:(input:T) => Component
  ){
    const element = document.querySelector(selector)! as HTMLButtonElement;
    element.addEventListener('click', () => {
      const dialog = new InputDialog();
      const input = new InputComponent();
      dialog.addChild(input);
      dialog.attachTo(this.dialogRoot);
// dialogRoot로 바꿔주면 document.body가 아니라 다른곳에서 추가, 제거하고 싶을 때, 한 군데에서만 변경하면 된다.
      dialog.setOnCloseListenr(() => {
        dialog.removeFrom(this.dialogRoot);
      });
      dialog.setOnSubmitListenr(() => {
        // 섹션을 만들어서 페이지에 추가 해준다
        const image = makeSection(input);
        this.page.addChild(image);
        dialog.removeFrom(this.dialogRoot);
      });
    });
  }
}
// dialogRoot로 바꿔주면 document.body가 아니라 다른곳에서 추가, 제거하고 싶을 때, 한 군데에서만 변경하면 된다.
new App(document.querySelector('.document')! as HTMLElement, document.body);
