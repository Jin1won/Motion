import { BaseComponent } from '../../component.js';

export class VideoComponent extends BaseComponent<HTMLElement>{
    constructor(title:string, url:string){
        super(`<section class="video">
                    <div class="video__player">
                        <h2 class="video__title"></h2>
                        <iframe class="video__iframe"></iframe>
                    </div>
                </section>`);

    const iframe = this.element.querySelector('.video__iframe')! as HTMLIFrameElement;
    console.log(url);   
    iframe.src = this.convertToEmbeddedURL(url);

    const titleElement = this.element.querySelector('.video__title')! as HTMLHeadingElement;
    titleElement.textContent = title;
    }
    //정규표현식 사용 (Regex)
    private convertToEmbeddedURL(url:string):string{
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtube.com\/(?:(?:watch\?v=)|(?:embed\/))([a-zA-Z0-9-]{11}))|(?:youtu.be\/([a-zA-Z0-9-]{11})))/;
        const match = url.match(regExp);
        console.log(match)
        const videoId = match? match[1] || match[2] : undefined;
        if(videoId){
            return `https:www.youtube.com/embed/${videoId}`;
        }
        return url;
    }
}