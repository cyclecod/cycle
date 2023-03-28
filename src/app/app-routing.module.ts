/*
 * @Author: 九阳
 * @Date: 2022-07-26 14:32:53
 * @LastEditors: 九阳
 * @LastEditTime: 2022-10-24 11:42:24
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PHLoginComponent } from './view/login/login.component';
import { TabBarComponent } from './view/tabs/tabs.component';
// 隐患排查
import { InvestigateComponent  } from './view/investigate/investigate.component';
import { InvestigateDetailComponent } from './view/investigate-detail/investigate-detail.component';
import { DangerDetailComponent } from './view/danger-detail/danger-detail.component';
import { DangerReviewComponent } from './view/danger-review/danger-review.component';
// import { ChooseDepartmentPage } from './view/chooseDepartment/choose.page';
import { DangerAddComponent } from './view/danger-add/danger-add.component';
import { DangerListComponent } from './view/danger-list/danger-list.page';
import { DiscoverDangerListComponent } from './view/discover-danger-list/discover-danger-list.page';
import { ExpireDangerListComponent } from './view/expire-danger-list/expire-danger-list.page';
import { TaskListComponent } from './view/task-list/task-list.page';
import { ExpireTaskListComponent } from './view/expire-task-list/expire-task-list.page';
import { DangerProcessComponent } from './view/danger-process/danger-process.component';
import { DangerAcceptComponent } from './view/danger-accept/danger-accept.component';
import {CustomTaskListComponent} from './view/custom-task-list/custom-task-list.page';
import {CustomAbnormalComponent} from './view/custom-abnormal/custom-abnormal.page'
 
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: PHLoginComponent
  },
  {
    path: 'tabs',
    component: TabBarComponent
  },
  {
    path: 'risk-investigate',
    component: InvestigateComponent
  },
  {
    path: 'risk-investigate-detail',
    component: InvestigateDetailComponent
  },
  {
    path: 'risk-danger-review',
    component: DangerReviewComponent
  },
  {
    path: 'risk-danger-detail',
    component: DangerDetailComponent
  },
  {
    path: 'risk-danger-add',
    component: DangerAddComponent
  },
  {
    path: 'risk-danger-discover',
    component: DiscoverDangerListComponent
  },
  {
    path: 'risk-danger-expire',
    component: ExpireDangerListComponent
  },
  {
    path: 'risk-danger-list',
    component: DangerListComponent
  },
  {
    path: 'risk-task-list',
    component: TaskListComponent
  },
  {
    path: 'risk-task-expire',
    component: ExpireTaskListComponent
  },
  {
    path: 'risk-danger-process',
    component: DangerProcessComponent
  },
  {
    path: 'risk-danger-accept',
    component: DangerAcceptComponent
  },
  {path: 'custom-task-list',
  component: CustomTaskListComponent
  },
  {path: 'custom-abnormal',
  component: CustomAbnormalComponent
  },

  // {
  //   path: 'choose-department',
  //   component: ChooseDepartmentPage
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
