import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post, RespondData } from './post.model';
import { PostsService } from './service/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching: boolean = false;
  error: string | null = null;

  private errorSub!: Subscription;

  constructor(
    private http: HttpClient,
    private postsService: PostsService) {}

  ngOnInit() {
    this.isFetching = true;

    this.errorSub = this.postsService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });

    this.postsService.fetchPosts().subscribe((posts) => {
      this.isFetching = false;
      this.loadedPosts = posts;
        console.log(posts)
      }, error => {
        this.isFetching = false;
        this.postsService.error.next(error.message);
      });
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postsService
      .createAndStorePost(postData.title, postData.content)
      .subscribe((responseData) => {
        console.log(responseData)
      }, error => {
        this.isFetching = false;
        this.postsService.error.next(error.message);
      });
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;

    this.postsService.fetchPosts().subscribe((posts) => {
      this.isFetching = false;
      this.loadedPosts = posts;
        console.log(posts)
      }, error => {
        this.isFetching = false;
        this.postsService.error.next(error.message);
      });
  }

  onClearPosts() {
    this.postsService.deletePosts()
      .subscribe(() => {
        console.log('Delete successful')
        this.loadedPosts = []
      }, error => {
        this.postsService.error.next(error.message);
      })
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
