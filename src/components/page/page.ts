import { BaseComponent } from '../component.js';

export class PageComponent extends BaseComponent<HTMLUListElement>{
    //자식 클래스에선 무조건 부모 클래스의 생성자를 호출해야 한다.
    constructor(){
        super('<ul class="page">This is PageComponent!</ul>');
    }
}