export interface Component {
    attachTo(parent: HTMLElement, position?: InsertPosition): void;
  }

//HTML element를 만드는 것을 캡슐화
//외부에서는 element가 어떻게 만들어지는지 신경 쓰지 않고도 원하는 string 타입의 HTML을 전달하면 element가 알아서 생성된다.
export class BaseComponent<T extends HTMLElement> implements Component {
    protected readonly element: T;
  
    constructor(htmlString: string) {
      const template = document.createElement('template');
      template.innerHTML = htmlString;
      this.element = template.content.firstElementChild! as T;
    }
  
    attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
      parent.insertAdjacentElement(position, this.element);
    }
}