import { Component } from './components/component';
import { Composable, PageComponent, PageItemComponent } from './components/page/page.js';
import { ImageComponent } from './components/page/item/image.js';
import { VideoComponent } from './components/page/item/video.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';

class App{
    private readonly page:Component & Composable;
    constructor(appRoot: HTMLElement){
        // 이제 다크모드 페이지나 다른 종류의 페이지 컴포넌트를 생성자에 전달만 해주면 다른 타입의 아이템을 만들 수 있다.
        this.page = new PageComponent(PageItemComponent);
        this.page.attachTo(appRoot);
        
        const image = new ImageComponent('Image Title','https://picsum.photos/600/300');
        this.page.addChild(image);

        const video = new VideoComponent('Video Title','https://youtu.be/bzd4n1OEML4');
        this.page.addChild(video);

        const note = new NoteComponent('Note Title','Note Body');
        this.page.addChild(note);

        const todo = new TodoComponent('Todo Title','Todo Item');
        this.page.addChild(todo);
    }
}

new App(document.querySelector('.document')! as HTMLElement);