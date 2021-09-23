import { Composable } from '../page/page.js';
import { BaseComponent, Component } from './../component.js';

// 무언가를 했는지 안했는지 알려주기만 하는 타입 리스너
type OnCloseListener = () => void;
type OnSubmitListener = () => void;

export interface MediaData{
  readonly title: string;
  readonly url: string;
}

export interface TextData{
  readonly title: string;
  readonly body : string;
}

export class InputDialog extends BaseComponent<HTMLElement> implements Composable {
  closeListener?: OnCloseListener;
  submitListener?: OnSubmitListener;

  constructor() {
    super(`<dialog class="dialog">
            <div class="dialog__container">
                <button class="close">&times;</button>
                <div id="dialog__body"></div>
                <button class="dialog__submit">ADD</button>
            </div>
            </dialog>`);
    const closeBtn = this.element.querySelector('.close')! as HTMLElement;
     // 컴포넌트 안에서 등록하는 곳이 한 군데라면 밑처럼 onClick으로 할당해도 상관없지만,
    // 만약 버튼을 다른 곳에서도 사용한다면 closeBtn.addEventListener('click',"") 다음과 같이 eventListener를 이용해서 처리하는 것이 더 좋다.
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };

    const submitBtn = this.element.querySelector('.dialog__submit')! as HTMLElement;
    submitBtn.onclick = () => {
      this.submitListener && this.submitListener();
    };
  }

  setOnCloseListenr(listener: OnCloseListener) {
    this.closeListener = listener;
  }
  setOnSubmitListenr(listener: OnSubmitListener) {
    this.submitListener = listener;
  }
  addChild(child: Component) {
    const body = this.element.querySelector('#dialog__body')! as HTMLElement;
    child.attachTo(body);
  }
}