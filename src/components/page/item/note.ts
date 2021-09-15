    import { BaseComponent } from '../../component.js';

    export class NoteComponent extends BaseComponent<HTMLElement>{
        //자식 클래스에선 무조건 부모 클래스의 생성자를 호출해야 한다.
        constructor(title:string, body:string){
            super(`<section class="note">
                        <h2 class="note__title"></h2>   
                        <p class="note__body"></p>
                    </section>`);     

            const titleElement = this.element.querySelector('.note__title')! as HTMLHeadElement;
            titleElement.textContent = title;

            const bodyElement = this.element.querySelector('.note__body')! as HTMLParagraphElement;
            bodyElement.textContent = body;
        }
    }