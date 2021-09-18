import { BaseComponent,Component } from '../component.js';

export interface Composable{
    addChild(child:Component):void;
}
// 어떤 component든 꼭 cloase버튼이 필요하기 때문에 setoncomponent를 꼭 구현해야 하므로 interface로 규격해놓는다.
interface SectionContainer extends Component, Composable{
    setOnCloseListener(listener:OnCloseListener):void;
}

type OnCloseListener = () => void;

// 여기서 생성자는  아무것도 받지 않지만, 생성자가 호출이 되면 sectioncontainer의 규격을 따라가는 어떤 클래스라도 타입에 맞는다.
type SectionContainerConstructor = {
    new():SectionContainer;
}
export class PageItemComponent extends BaseComponent<HTMLElement> implements SectionContainer{
    private closeListener?:OnCloseListener;
    constructor(){
        super(`<li class="page-item">
                    <section class="page-item__body"></section>
                    <dic class="page-item__controls">
                        <button class="close">&times;</button>
                    </div>
                </li>`);
        const cloasBtn = this.element.querySelector('.close')! as HTMLElement;
        cloasBtn.onclick = () =>{
            this.closeListener && this.closeListener();
        } 
    }
    addChild(child:Component){
        const container = this.element.querySelector('.page-item__body')! as HTMLElement;
        child.attachTo(container);
    }
    //외부에서 listener를 받아오는 함수
    setOnCloseListener(listener:OnCloseListener){
        this.closeListener = listener;
    }
}
export class PageComponent extends BaseComponent<HTMLUListElement>{
    constructor(private pageItemConstructor:SectionContainerConstructor){
        super('<ul class="page"></ul>');
    }
    addChild(section:Component){
        const item = new this.pageItemConstructor();
        item.addChild(section);
        item.attachTo(this.element, 'beforeend');
        item.setOnCloseListener(()=>{
            item.removeFrom(this.element);
        })
    }
}