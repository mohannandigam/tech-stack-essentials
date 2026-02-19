# Angular - The Complete Application Framework

## What is Angular?

Angular is a comprehensive TypeScript-based framework for building web applications. Created and maintained by Google, it provides everything you need out of the box—from routing and state management to forms and HTTP clients. Unlike React (library) or Vue (progressive framework), Angular is a full platform with strong opinions on how to structure applications.

### Simple Analogy

Think of frontend frameworks like restaurants:

- **React** = A food truck with a great chef and basic equipment—you choose your own ingredients and tools, very flexible
- **Vue** = A cozy café with good recipes and optional extras—start simple, add features as needed
- **Angular** = A professional restaurant kitchen with every tool, clear workflows, and strict procedures—everything you need, but you follow the house rules

Angular gives you the complete toolkit and tells you the best way to use it. Less freedom, more guidance.

## Why Angular Matters

### Enterprise Standard

- **Used by**: Google, Microsoft, Forbes, PayPal, Upwork, Samsung, HBO
- **Enterprise adoption**: Preferred by large organizations
- **Long-term support**: Predictable release schedule, clear deprecation policies
- **Corporate backing**: Full support from Google
- **Mature ecosystem**: Battle-tested solutions for complex requirements

### Key Advantages

1. **Complete Solution**: Everything included (no decision fatigue)
2. **TypeScript First**: Type safety throughout
3. **Strong Structure**: Clear patterns and conventions
4. **Powerful CLI**: Scaffolding, testing, build tools
5. **Dependency Injection**: Clean, testable architecture
6. **RxJS Integration**: Reactive programming for complex async
7. **Enterprise Focus**: Scalability, maintainability, team collaboration

### Philosophy

Angular believes in:

- **Convention over configuration**: One right way to do things
- **Explicit over implicit**: Clear declarations and dependencies
- **Opinionated architecture**: Follow the patterns, avoid reinventing
- **Comprehensive tooling**: CLI handles everything

This makes Angular **harder to learn** but **easier to maintain at scale** with large teams.

## Angular Fundamentals

### Components

Components are the basic building blocks of Angular applications.

```typescript
// user-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  // Input property (from parent)
  @Input() user!: User;
  @Input() showActions: boolean = true;

  // Output event (to parent)
  @Output() userSelected = new EventEmitter<number>();
  @Output() userDeleted = new EventEmitter<number>();

  // Component state
  isExpanded: boolean = false;

  // Methods
  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  selectUser(): void {
    this.userSelected.emit(this.user.id);
  }

  deleteUser(): void {
    this.userDeleted.emit(this.user.id);
  }
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}
```

```html
<!-- user-card.component.html -->
<div class="user-card" [class.expanded]="isExpanded">
  <img [src]="user.avatar || 'default-avatar.png'" [alt]="user.name">

  <div class="user-info">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>

    <div *ngIf="isExpanded" class="details">
      <p>Additional user details...</p>
    </div>
  </div>

  <div class="actions" *ngIf="showActions">
    <button (click)="toggleExpanded()">
      {{ isExpanded ? 'Show Less' : 'Show More' }}
    </button>
    <button (click)="selectUser()">Select</button>
    <button (click)="deleteUser()" class="danger">Delete</button>
  </div>
</div>
```

```css
/* user-card.component.css */
.user-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.user-card.expanded {
  background-color: #f5f5f5;
}

img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.actions button {
  margin-right: 0.5rem;
}

.danger {
  color: red;
}
```

**Component Lifecycle Hooks:**

```typescript
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-lifecycle-example',
  template: '<p>Lifecycle Example</p>'
})
export class LifecycleExampleComponent implements OnInit, OnDestroy, OnChanges {

  // Called once when component is initialized
  ngOnInit(): void {
    console.log('Component initialized');
    // Fetch data, setup subscriptions
  }

  // Called when input properties change
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Input changed:', changes);
  }

  // Called once before component is destroyed
  ngOnDestroy(): void {
    console.log('Component destroyed');
    // Cleanup: unsubscribe, clear timers
  }

  // Other lifecycle hooks:
  // ngOnChanges - when input properties change
  // ngOnInit - after first ngOnChanges
  // ngDoCheck - custom change detection
  // ngAfterContentInit - after content projection
  // ngAfterContentChecked - after content change detection
  // ngAfterViewInit - after view initialization
  // ngAfterViewChecked - after view change detection
  // ngOnDestroy - cleanup
}
```

### Templates

Angular uses HTML with special syntax for data binding and directives.

```html
<!-- Interpolation -->
<h1>{{ title }}</h1>
<p>{{ user.name }}</p>
<p>{{ 1 + 1 }}</p>
<p>{{ getFullName() }}</p>

<!-- Property binding -->
<img [src]="imageUrl" [alt]="description">
<button [disabled]="isDisabled">Click</button>
<div [class.active]="isActive">
<div [style.color]="textColor">

<!-- Event binding -->
<button (click)="handleClick()">Click</button>
<input (input)="handleInput($event)" (keyup.enter)="handleEnter()">
<form (submit)="handleSubmit($event)">

<!-- Two-way binding -->
<input [(ngModel)]="name">
<!-- Expands to: -->
<input [ngModel]="name" (ngModelChange)="name = $event">

<!-- Structural directives -->

<!-- *ngIf - conditional rendering -->
<div *ngIf="isVisible">Visible</div>
<div *ngIf="user; else loading">
  {{ user.name }}
</div>
<ng-template #loading>
  <div>Loading...</div>
</ng-template>

<!-- *ngFor - list rendering -->
<ul>
  <li *ngFor="let item of items">{{ item.name }}</li>
</ul>

<!-- With index -->
<li *ngFor="let item of items; let i = index">
  {{ i }}: {{ item.name }}
</li>

<!-- Track by (for performance) -->
<li *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</li>

<!-- *ngSwitch - switch statement -->
<div [ngSwitch]="status">
  <p *ngSwitchCase="'loading'">Loading...</p>
  <p *ngSwitchCase="'success'">Success!</p>
  <p *ngSwitchCase="'error'">Error occurred</p>
  <p *ngSwitchDefault>Unknown status</p>
</div>

<!-- Pipes (data transformation) -->
<p>{{ date | date:'short' }}</p>
<p>{{ price | currency:'USD' }}</p>
<p>{{ text | uppercase }}</p>
<p>{{ text | lowercase }}</p>
<p>{{ items | json }}</p>
<p>{{ value | number:'1.2-2' }}</p>

<!-- Custom pipe -->
<p>{{ text | myCustomPipe:arg1:arg2 }}</p>

<!-- Template reference variables -->
<input #nameInput type="text">
<button (click)="focusInput(nameInput)">Focus Input</button>

<!-- Safe navigation operator -->
<p>{{ user?.address?.city }}</p>
<!-- Won't error if user or address is null/undefined -->
```

### Modules

Modules organize applications into cohesive blocks.

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { UserListComponent } from './components/user-list/user-list.component';

@NgModule({
  declarations: [
    // Components, directives, pipes
    AppComponent,
    UserCardComponent,
    UserListComponent
  ],
  imports: [
    // Other modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    // Services
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// Feature module
@NgModule({
  declarations: [
    UserCardComponent,
    UserListComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    UserCardComponent,
    UserListComponent
  ]
})
export class UserModule { }
```

**Standalone Components (Angular 14+):**

Simpler alternative to modules.

```typescript
// user-card.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  // Component code
}
```

## Services and Dependency Injection

Services handle business logic and data—components stay focused on the view.

```typescript
// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root' // Available app-wide
})
export class UserService {
  private apiUrl = '/api/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  // GET all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      tap(users => this.usersSubject.next(users)),
      catchError(this.handleError)
    );
  }

  // GET user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // POST create user
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(newUser => {
        const users = this.usersSubject.value;
        this.usersSubject.next([...users, newUser]);
      }),
      catchError(this.handleError)
    );
  }

  // PUT update user
  updateUser(id: number, updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updatedUser => {
        const users = this.usersSubject.value.map(u =>
          u.id === id ? updatedUser : u
        );
        this.usersSubject.next(users);
      }),
      catchError(this.handleError)
    );
  }

  // DELETE user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const users = this.usersSubject.value.filter(u => u.id !== id);
        this.usersSubject.next(users);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => new Error('Something went wrong'));
  }
}

// Using service in component
@Component({
  selector: 'app-user-list',
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">Error: {{ error }}</div>

    <ul *ngIf="!loading && !error">
      <li *ngFor="let user of users">
        {{ user.name }} - {{ user.email }}
      </li>
    </ul>
  `
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = true;
  error: string | null = null;
  private subscription?: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.subscription = this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
```

## RxJS and Reactive Programming

Angular uses RxJS extensively for handling async operations.

### Observables Basics

```typescript
import { Observable, of, from, interval, fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

// Create observables
const numbers$ = of(1, 2, 3, 4, 5);
const fromArray$ = from([1, 2, 3]);
const timer$ = interval(1000); // Emits every second
const clicks$ = fromEvent(button, 'click');

// Subscribe to observable
numbers$.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error(err),
  complete: () => console.log('Complete')
});

// Operators
numbers$.pipe(
  map(n => n * 2),
  filter(n => n > 5)
).subscribe(result => console.log(result));

// Search with debounce
searchInput$.pipe(
  debounceTime(300),        // Wait 300ms after typing
  distinctUntilChanged(),   // Only if value changed
  switchMap(term =>         // Switch to new API call
    this.searchService.search(term)
  )
).subscribe(results => {
  this.searchResults = results;
});
```

### Common RxJS Patterns

```typescript
// Combine multiple API calls
import { forkJoin, combineLatest, merge } from 'rxjs';

// Wait for all to complete
forkJoin({
  users: this.userService.getUsers(),
  posts: this.postService.getPosts(),
  comments: this.commentService.getComments()
}).subscribe(({ users, posts, comments }) => {
  // All data loaded
});

// Combine latest values
combineLatest([
  this.filter$,
  this.sortOrder$,
  this.items$
]).pipe(
  map(([filter, sortOrder, items]) => {
    return this.filterAndSort(items, filter, sortOrder);
  })
).subscribe(processedItems => {
  this.displayItems = processedItems;
});

// Handle multiple streams
merge(
  this.stream1$,
  this.stream2$,
  this.stream3$
).subscribe(value => {
  // Handle all streams
});

// Cancel previous requests
searchTerm$.pipe(
  switchMap(term => this.api.search(term))
).subscribe(results => {
  // Only latest search results
});

// Retry on error
this.http.get(url).pipe(
  retry(3),
  catchError(error => {
    return of([]);
  })
).subscribe(data => {
  // Data or empty array
});
```

### Subjects

```typescript
import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';

// Subject - multicast to multiple subscribers
const subject = new Subject<number>();
subject.subscribe(value => console.log('A:', value));
subject.subscribe(value => console.log('B:', value));
subject.next(1); // Both log: A: 1, B: 1

// BehaviorSubject - has current value
const behaviorSubject = new BehaviorSubject<number>(0);
behaviorSubject.subscribe(value => console.log('Current:', value)); // Logs: 0
behaviorSubject.next(1);
behaviorSubject.subscribe(value => console.log('Late:', value)); // Logs: 1

// ReplaySubject - replays last N values
const replaySubject = new ReplaySubject<number>(2);
replaySubject.next(1);
replaySubject.next(2);
replaySubject.next(3);
replaySubject.subscribe(value => console.log(value)); // Logs: 2, 3
```

## Forms

Angular has two approaches to forms: Template-driven and Reactive.

### Template-Driven Forms

```typescript
// component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  user = {
    name: '',
    email: '',
    age: 0
  };

  onSubmit(form: any): void {
    console.log('Form submitted:', this.user);
  }
}
```

```html
<!-- template-driven form -->
<form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)">
  <div>
    <label for="name">Name:</label>
    <input
      type="text"
      id="name"
      name="name"
      [(ngModel)]="user.name"
      required
      minlength="3"
      #name="ngModel"
    >
    <div *ngIf="name.invalid && name.touched" class="error">
      <p *ngIf="name.errors?.['required']">Name is required</p>
      <p *ngIf="name.errors?.['minlength']">Name must be at least 3 characters</p>
    </div>
  </div>

  <div>
    <label for="email">Email:</label>
    <input
      type="email"
      id="email"
      name="email"
      [(ngModel)]="user.email"
      required
      email
      #email="ngModel"
    >
    <div *ngIf="email.invalid && email.touched" class="error">
      <p *ngIf="email.errors?.['required']">Email is required</p>
      <p *ngIf="email.errors?.['email']">Invalid email</p>
    </div>
  </div>

  <button type="submit" [disabled]="userForm.invalid">Submit</button>
</form>
```

### Reactive Forms (Recommended)

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: [0, [Validators.required, Validators.min(0), Validators.max(120)]],
      address: this.fb.group({
        street: [''],
        city: [''],
        zipCode: ['', Validators.pattern(/^\d{5}$/)]
      })
    });

    // Watch for changes
    this.userForm.get('name')?.valueChanges.subscribe(value => {
      console.log('Name changed:', value);
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Form value:', this.userForm.value);
      // Submit to API
    } else {
      console.log('Form is invalid');
      this.userForm.markAllAsTouched();
    }
  }

  // Custom validator
  ageValidator(control: FormControl): {[key: string]: any} | null {
    const age = control.value;
    if (age < 18) {
      return { underage: true };
    }
    return null;
  }

  // Getter for easy access in template
  get name() {
    return this.userForm.get('name');
  }

  get email() {
    return this.userForm.get('email');
  }
}
```

```html
<!-- reactive form template -->
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="name">Name:</label>
    <input
      type="text"
      id="name"
      formControlName="name"
    >
    <div *ngIf="name?.invalid && name?.touched" class="error">
      <p *ngIf="name?.errors?.['required']">Name is required</p>
      <p *ngIf="name?.errors?.['minlength']">
        Name must be at least {{ name?.errors?.['minlength'].requiredLength }} characters
      </p>
    </div>
  </div>

  <div>
    <label for="email">Email:</label>
    <input
      type="email"
      id="email"
      formControlName="email"
    >
    <div *ngIf="email?.invalid && email?.touched" class="error">
      <p *ngIf="email?.errors?.['required']">Email is required</p>
      <p *ngIf="email?.errors?.['email']">Invalid email format</p>
    </div>
  </div>

  <!-- Nested form group -->
  <div formGroupName="address">
    <input type="text" formControlName="street" placeholder="Street">
    <input type="text" formControlName="city" placeholder="City">
    <input type="text" formControlName="zipCode" placeholder="Zip Code">
  </div>

  <button type="submit" [disabled]="userForm.invalid">Submit</button>
</form>
```

## Routing

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/:id', component: UserDetailComponent },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// Using router in component
@Component({
  selector: 'app-user-list',
  template: `
    <ul>
      <li *ngFor="let user of users">
        <a [routerLink]="['/users', user.id]">{{ user.name }}</a>
      </li>
    </ul>
  `
})
export class UserListComponent {
  constructor(private router: Router) {}

  navigateToUser(id: number): void {
    this.router.navigate(['/users', id]);
  }

  navigateWithQuery(): void {
    this.router.navigate(['/users'], {
      queryParams: { page: 2, sort: 'name' }
    });
  }
}

// Access route params
@Component({
  selector: 'app-user-detail',
  template: '<p>User ID: {{ userId }}</p>'
})
export class UserDetailComponent implements OnInit {
  userId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Snapshot (one-time read)
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    // Observable (reactive)
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('id'));
    });

    // Query params
    this.route.queryParams.subscribe(params => {
      const page = params['page'];
      const sort = params['sort'];
    });
  }
}

// Route guard
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
```

## State Management with NgRx

NgRx is Redux for Angular.

```typescript
// state/user.actions.ts
import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';

export const loadUsers = createAction('[User List] Load Users');
export const loadUsersSuccess = createAction(
  '[User API] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[User API] Load Users Failure',
  props<{ error: string }>()
);

// state/user.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, state => ({
    ...state,
    loading: true
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

// state/user.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const selectUserState = createFeatureSelector<UserState>('users');

export const selectAllUsers = createSelector(
  selectUserState,
  (state) => state.users
);

export const selectUsersLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

// state/user.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map(users => UserActions.loadUsersSuccess({ users })),
          catchError(error =>
            of(UserActions.loadUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
}

// Using in component
@Component({
  selector: 'app-user-list',
  template: `
    <div *ngIf="loading$ | async">Loading...</div>
    <ul *ngIf="users$ | async as users">
      <li *ngFor="let user of users">{{ user.name }}</li>
    </ul>
  `
})
export class UserListComponent implements OnInit {
  users$ = this.store.select(selectAllUsers);
  loading$ = this.store.select(selectUsersLoading);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadUsers());
  }
}
```

## Testing

```typescript
// Component testing
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCardComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    component.user = { id: 1, name: 'Alice', email: 'alice@example.com' };
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Alice');
  });

  it('should emit event on button click', () => {
    spyOn(component.userSelected, 'emit');

    component.user = { id: 1, name: 'Alice', email: 'alice@example.com' };
    component.selectUser();

    expect(component.userSelected.emit).toHaveBeenCalledWith(1);
  });
});

// Service testing
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users', () => {
    const mockUsers = [
      { id: 1, name: 'Alice', email: 'alice@example.com' }
    ];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
```

## Best Practices

### Use OnPush Change Detection

```typescript
@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class UserCardComponent {
  // Only checks when inputs change or events fire
}
```

### Unsubscribe from Observables

```typescript
// Pattern 1: Manual unsubscribe
export class Component implements OnDestroy {
  private subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.service.getData().subscribe(data => {})
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

// Pattern 2: takeUntil
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.service.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {});
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

// Pattern 3: async pipe (automatic)
data$ = this.service.getData();
// Template: {{ data$ | async }}
```

## Quick Reference

| Feature | Purpose |
|---------|---------|
| `@Component` | Define component |
| `@Injectable` | Mark service |
| `@Input` | Receive data from parent |
| `@Output` | Send events to parent |
| `[(ngModel)]` | Two-way binding |
| `*ngIf` | Conditional rendering |
| `*ngFor` | List rendering |
| `[property]` | Property binding |
| `(event)` | Event binding |
| `{{ value }}` | Interpolation |

## Next Steps

### Projects

1. **Todo App** - Forms, routing, services
2. **Dashboard** - Charts, real-time data, NgRx
3. **E-commerce** - Complex state, routing, guards
4. **Admin Panel** - Tables, forms, CRUD operations

### Advanced Topics

- **Change Detection Strategies**
- **Lazy Loading Modules**
- **Server-Side Rendering (Angular Universal)**
- **Progressive Web Apps**
- **Web Components with Angular Elements**

## Related Topics

- [React](../react/README.md) - Library alternative
- [Vue](../vue/README.md) - Framework alternative
- [TypeScript](../../01-programming/typescript/README.md) - Core language
- [Frontend Overview](../README.md) - Complete roadmap

---

**Remember:** Angular's power comes from its completeness and structure. It has a steeper learning curve than React or Vue, but pays dividends in large applications with multiple teams. Embrace TypeScript, learn RxJS, follow the patterns, and trust the framework's opinions. Angular is about long-term maintainability over quick flexibility.
