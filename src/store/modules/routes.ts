import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from './..';

export interface IRoutes {
  key?: number;
  title?: string;
  code?: string;
  path?: string;
  icon?: string;
  affix?: Boolean,
  reuse?: Boolean,
  breadCrumb?: string;
  children?: IRoutes[];
}

export interface IRoutesState {
  routes: IRoutes[];
}
@Module({ dynamic: true, store, name: 'Routes' })
class Routes extends VuexModule implements IRoutesState {
  public routes: IRoutes[] = [];

  @Mutation
  private SET_ROUTES(routes: IRoutes[]) {
    this.routes.push(...routes);
  }

  @Action
  public SetRoutes(routes: any[]) {
    this.SET_ROUTES(routes);
  }
}

export const RoutesModule = getModule(Routes);
