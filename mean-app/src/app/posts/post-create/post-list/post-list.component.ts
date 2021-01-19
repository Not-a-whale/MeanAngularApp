import { Component } from '@angular/core';

@Component({
  selector: 'app-posts-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list-component.css'],
})
export class PostListComponent {
  posts = [];
}
