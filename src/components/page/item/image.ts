import { BaseComponent } from '../../component.js';

export class ImageComponent extends BaseComponent<HTMLElement>{
    constructor(title:string, url:string){
        super(`<section class="image">
                    <div class="image__holder"><img class="image__thumbnail"></div>
                    <h2 class="image__title"></h2>
                    <h2 class="page-item__title image__title"></h2>
                </section>`);
        
    // 바로 innerHTML안에 title이나 url을 넣는 것 보다 필요한 것들만 믿처럼 만들어서 넣는 것이 좋다.

    const imageElement = this.element.querySelector('.image__thumbnail')! as HTMLImageElement;
    imageElement.src = url;
    imageElement.alt = title;

    const titleElement = this.element.querySelector('.image__title')! as HTMLParagraphElement;
    titleElement.textContent = title;
    }
}