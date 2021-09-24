import { BaseComponent,Component } from '../component.js';

export interface Composable{
    addChild(child:Component):void;
}
// 어떤 component든 꼭 cloase버튼이 필요하기 때문에 setoncomponent를 꼭 구현해야 하므로 interface로 규격해놓는다.
interface SectionContainer extends Component, Composable{
    setOnCloseListener(listener:OnCloseListener):void;
    setOnDragStateListener(listener:OnDragStateListener<SectionContainer>):void;
    muteChildren(state: 'mute' | 'unmute'): void;
    getBoundingRect(): DOMRect;
    onDropped():void;
}

type OnCloseListener = () => void;
type DragState = 'start' | 'stop' | 'enter' | 'leave';
// 여기서 target을 PageItemComponent로 하면 이 리스너는 PageItemCompoenet에서밖에 못쓴다.
// 또한, Component라고 하면 PageItemComponent 서브타입을 전달하는 순간 타입의 정보가 사라지므로 타입이 안전하지만 타입이 보존되는 제네릭을 사용한다.
// 이렇게 하면 PageItemComponent뿐 만 아니라 다른 곳에서도 타입만 바꿔서 사용할 수 있다.
type OnDragStateListener<T extends Component> = (target: T, state: DragState) => void;

// 여기서 생성자는  아무것도 받지 않지만, 생성자가 호출이 되면 sectioncontainer의 규격을 따라가는 어떤 클래스라도 타입에 맞는다.
type SectionContainerConstructor = {
    new():SectionContainer;
}
export class PageItemComponent extends BaseComponent<HTMLElement> implements SectionContainer{
    private closeListener?:OnCloseListener;
    private dragStateListener?:OnDragStateListener<PageItemComponent>;
    constructor(){
        super(`<li draggable="true" class="page-item">
                    <section class="page-item__body"></section>
                    <div class="page-item__controls">
                        <button class="close">&times;</button>
                    </div>
                </li>`);
        const cloasBtn = this.element.querySelector('.close')! as HTMLElement;
        cloasBtn.onclick = () =>{
            this.closeListener && this.closeListener();
        } 
        this.element.addEventListener('dragstart',(event: DragEvent)=>{
            this.onDragStart(event);
        })
        this.element.addEventListener('dragend',(event: DragEvent)=>{
            this.onDragEnd(event);
        })
        this.element.addEventListener('dragenter',(event: DragEvent)=>{
            this.onDragEnter(event);
        })
        this.element.addEventListener('dragleave',(event: DragEvent)=>{
            this.onDragLeave(event);
        })
    }
    // 아무것도 리턴하지 않고 이벤트를 처리만 하는 함수
    onDragStart(_: DragEvent){
        this.notifyDragObservers('start');
        this.element.classList.add('lifted');
    }
    onDragEnd(_: DragEvent){
        this.notifyDragObservers('stop');  
        this.element.classList.remove('lifted'); 
    }
    onDragEnter(_: DragEvent){
        this.notifyDragObservers('enter');
        this.element.classList.add('drop-area'); 
    }
    onDragLeave(_: DragEvent){
        this.notifyDragObservers('leave');
        this.element.classList.remove('drop-area'); 
    }
    onDropped(){
        this.element.classList.remove('drop-area'); 
    }
    notifyDragObservers(state:DragState){
        this.dragStateListener && this.dragStateListener(this,state);
    }
    addChild(child:Component){
        const container = this.element.querySelector('.page-item__body')! as HTMLElement;
        child.attachTo(container);
    }
    //외부에서 listener를 받아오는 함수
    setOnCloseListener(listener:OnCloseListener){
        this.closeListener = listener;
    }
    setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>){
        this.dragStateListener = listener;
    }
    muteChildren(state: 'mute' | 'unmute'){
        if (state === 'mute'){
            this.element.classList.add('mute-children');
        } else{
            this.element.classList.remove('mute-children');
        }
    }
    getBoundingRect(): DOMRect{
        return this.element.getBoundingClientRect();
    }
}
export class PageComponent extends BaseComponent<HTMLUListElement>{
    private children = new Set<SectionContainer>();
    private dropTarget?: SectionContainer;
    private dragTarget?: SectionContainer;
    
    constructor(private pageItemConstructor:SectionContainerConstructor){
        super('<ul class="page"></ul>');
        this.element.addEventListener('dragover',(event: DragEvent)=>{
            this.onDragOver(event);
        })
    
        this.element.addEventListener('drop',(event: DragEvent)=>{
            this.onDrop(event);
        })
    }
    onDragOver(event: DragEvent){
        event.preventDefault();
        // console.log('dragover',event);
    }
    onDrop(event: DragEvent){
        event.preventDefault();
        // console.log('drop',event);
        // 위치를 바꾼다.
        if(!this.dropTarget){
            return;
        }
        if(this.dragTarget && this.dragTarget !== this.dropTarget){
            const dropY = event.clientY;
            const srcElement = this.dragTarget.getBoundingRect();
            this.dragTarget.removeFrom(this.element);
            // droptarget의 이전, 즉 형제요소에 붙여줄 것이므로 beforebegin
            this.dropTarget.attach(this.dragTarget,dropY < srcElement.y ? 'beforebegin':'afterend');
        }
        this.dropTarget.onDropped();
    }
    addChild(section:Component){
        // 전달받은 것들을 pageItemComponent로 감싸준다!!!
        const item = new this.pageItemConstructor();
        // 새로만든 pageItem에 전달받은 section을 추가해준다.
        item.addChild(section);
        // 만든 아이템을 현재 페이지에 붙여준다. 여기서의 this는 페이지의 element를 나타낸다.
        item.attachTo(this.element, 'beforeend');
        item.setOnCloseListener(()=>{
            item.removeFrom(this.element);
            this.children.delete(item);
        })
        this.children.add(item);
        item.setOnDragStateListener((target: SectionContainer, state: DragState)=>{
            switch (state) {
                case 'start':
                    this.dragTarget = target;
                    this.updateSections('mute');
                    break;
                case 'stop':
                    this.dragTarget = undefined;
                    this.updateSections('unmute');
                    break;
                case 'enter':
                    this.dropTarget = target;
                    break;
                case 'leave':
                    this.dropTarget = undefined;
                    break;
                default:
                    throw new Error(`unsupported state: ${state }`)
            }
        })
    }

    private updateSections(state:'mute' | 'unmute'){
        this.children.forEach((section: SectionContainer) => {
            section.muteChildren(state);
        })
    }
}