import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list-component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  @Input() posts: Post[] = [];
  isLoading = false;

  postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onDelete(id: string) {
    this.postsService.deletePost(id);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
