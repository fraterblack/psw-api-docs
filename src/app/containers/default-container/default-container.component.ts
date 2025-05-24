import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

import { Location } from '@angular/common';
import { MatDrawerContent } from '@angular/material/sidenav';
import { DialogClosed } from '../../core/interfaces/dialog-closed.interface';
import { Auth } from '../../core/models/auth.model';
import { DialogService } from '../../core/services/dialog.service';
import { AuthStore } from '../../core/stores/auth.store';
import { Unsubscrable } from '../../shared/views/extendable/unsubscrable';
import { AuthenticationComponent } from '../../views/shared/authentication/authentication.component';
import { ViewRoute } from './../../core/enums/view-route.enum';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-container.component.html'
})
export class DefaultContainerComponent extends Unsubscrable implements OnInit, OnDestroy {
  @ViewChild('matDrawerRef', { static: false }) matDrawerRef: MatDrawerContent;

  title: string;

  drawerMode: 'over' | 'side' = 'over';
  drawerOpened = false;
  mainMenu: any[] = [
    {
      route: ViewRoute.ABOUT,
      icon: 'home',
      name: 'Início',
    },
    {
      route: ViewRoute.DIRECTORY,
      icon: 'list',
      name: 'Cadastros',
    },
    {
      route: ViewRoute.REPORTS,
      icon: 'data_object',
      name: 'Relatórios',
    },
  ];
  authentication: Auth;

  private outlet = 'primary';

  constructor(
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private authStore: AuthStore,
  ) {
    super();

    // Subscribe to listen auth store changes
    this.authStore.data
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(auth => {
        this.authentication = auth;
      });

    // Watch for route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event) => {
        const titles: any[] = [];
        let currentRoute: ActivatedRoute | null = this.route.root;
        do {
          const childrenRoutes: ActivatedRoute[] = currentRoute.children;
          currentRoute = null;
          childrenRoutes.forEach((childRoute) => {

            if (childRoute.outlet === this.outlet) {
              currentRoute = childRoute;

              if (childRoute.snapshot.data['title']) {
                titles.push(childRoute.snapshot.data['title']);
              }
            }
          });
        } while (currentRoute);

        if (titles.length) {
          this.title = titles.join(' » ');
        } else {
          this.title = null;
        }
      });

    // Watch for resize events
    window.addEventListener('resize', () => this.handleDrawerMode());

    // Ensure remove dialog=open fragment from URL
    this.dialogService.unsetFullDialogOpenState(true);

    // Control opened full dialogs
    let openFullDialogControl = 0;
    location
      .onUrlChange((currentUrl) => {
        const dialogParam = this.getDialogValue(currentUrl);

        if (dialogParam) {
          if (dialogParam < openFullDialogControl) {
            this.dialogService.closeDialog(`full-dialog-${openFullDialogControl}`);
          }
          openFullDialogControl = dialogParam;
        } else {
          openFullDialogControl = 0;
          this.dialogService.closeDialog(`full-dialog-1`);
        }
      });

    this.handleDrawerMode();
  }

  private getDialogValue(url: string): number | null {
    const regex = /dialog=(\d+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      return parseInt(match[1], 10);
    }

    return null;
  }

  onAuthenticate() {
    this.dialogService
      .openFullDialog<AuthenticationComponent, DialogClosed<any>>(
        AuthenticationComponent,
        true,
        {},
      )
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => { });
  }

  onDeauthenticate() {
    this.authStore.reset();
  }

  onClickMenu(drawer: any, item: any) {
    if (this.drawerMode === 'over') {
      drawer.close();
    }
  }

  async ngOnInit() {
    setTimeout(() => {
      this.matDrawerRef.elementScrolled()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(ev => {
          // Workaround to" attach" matdrawer scroll event to document
          document.dispatchEvent(new Event('scroll'));
        });
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onOpenedChanged() {
    if (this.drawerMode === 'side') {
      // If in 'side' drawer mode, trigger resize event to document
      window.dispatchEvent(new Event('resize'));
    }
  }

  private handleDrawerMode() {
    this.drawerMode = window.innerWidth < 1000 ? 'over' : 'side';
    this.drawerOpened = window.innerWidth < 1000 ? false : true;
  }
}
